const Account = require("../models/account-model"); // PascalCase for Model import
const { cloudinary } = require("../config/cloudinary"); // NAYI IMPORT: Cloudinary safayi ke liye

// ==========================================
// HELPER: URL se Public ID nikalne ka Jadoo
// Cloudinary URL se folder aur filename nikalta hai delete karne ke liye
// ==========================================
const extractPublicId = (imageUrl) => {
  const parts = imageUrl.split("/");
  const filename = parts.pop(); // e.g., xyz123.jpg
  const folder = parts.pop(); // e.g., snapify_accounts
  return `${folder}/${filename.split(".")[0]}`; // e.g., snapify_accounts/xyz123
};

// ==========================================
// @desc    Naya Account Create Karna (Admin) - WITH ROLLBACK
// @route   POST /api/accounts
// @access  Private (Admin only - middleware baad mein lagayenge)
// ==========================================
const createAccount = async (req, res) => {
  try {
    // req.body mein frontend se aane wala saara data hoga
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();

    res.status(201).json({
      success: true,
      message: "Account successfully created",
      data: savedAccount,
    });
  } catch (error) {
    console.error("Database Save Failed! Running Rollback... 🚨");

    // ==========================================
    // THE ROLLBACK: Agar DB fail hua, toh Cloudinary se kachra saaf karo!
    // ==========================================
    if (req.body.images && req.body.images.length > 0) {
      try {
        for (const imageUrl of req.body.images) {
          const publicId = extractPublicId(imageUrl);
          await cloudinary.uploader.destroy(publicId);
          console.log(`Rollback: Deleted orphaned image -> ${publicId}`);
        }
      } catch (cloudinaryErr) {
        console.error(
          "Rollback Failed to delete from Cloudinary:",
          cloudinaryErr,
        );
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to create account",
      error: error.message,
    });
  }
};

// ==========================================
// @desc    Account aur uski tasweerein Delete karna (Admin)
// @route   DELETE /api/accounts/:id
// @access  Private (Admin only)
// ==========================================
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // 1. Pehle Cloudinary se tasweerein urao!
    if (account.images && account.images.length > 0) {
      for (const imageUrl of account.images) {
        const publicId = extractPublicId(imageUrl);
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      }
    }

    // 2. Phir Database se account ura do!
    await account.deleteOne();

    res.status(200).json({
      success: true,
      message: "Account and images completely deleted!",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

// ==========================================
// @desc    Saare Available Accounts Fetch Karna (Public)
// @route   GET /api/accounts
// @access  Public (Dukan ke frontend ke liye)
// ==========================================
const getAllAccounts = async (req, res) => {
  try {
    // SECURITY MAGIC: Sirf wo accounts lao jo biki nahi hain (isSold: false)
    // Aur '-' laga kar secret fields ko hide kar do (Public Data only)
    const accounts = await Account.find({ isSold: false }).select(
      "-snapchatUsername -snapchatPassword -recoveryEmail -emailPassword",
    );

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch accounts",
      error: error.message,
    });
  }
};

// ==========================================
// @desc    Ek Single Account ki Details Fetch Karna (Public)
// @route   GET /api/accounts/:id
// @access  Public (Details Page ke liye)
// ==========================================
const getAccountById = async (req, res) => {
  try {
    // req.params.id se hum URL wali ID pakrenge
    // Yahan bhi secret details ko hide karna lazmi hai
    const account = await Account.findById(req.params.id).select(
      "-snapchatUsername -snapchatPassword -recoveryEmail -emailPassword",
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch account details",
      error: error.message,
    });
  }
};
// ==========================================
// @desc    Account Update Karna (Admin) - SMART IMAGE DIFF
// @route   PUT /api/accounts/:id
// @access  Private (Admin only)
// ==========================================
const updateAccount = async (req, res) => {
  try {
    let account = await Account.findById(req.params.id);

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // ==========================================
    // JADOO: Smart Image Delete Logic
    // ==========================================
    // Agar frontend ne images ka array bheja hai (jisme purani bachi hui + nayi upload ki hui hain)
    if (req.body.images && Array.isArray(req.body.images)) {
      const existingImages = account.images || [];
      const incomingImages = req.body.images; // Frontend se aane wali tasweerein

      // Wo tasweerein dhoondo jo Database mein hain lekin Frontend ne nahi bhejin (Yani user ne Delete kar di hain)
      const imagesToDelete = existingImages.filter(
        (img) => !incomingImages.includes(img),
      );

      // Sirf unhi tasweeron ko Cloudinary se urao jo user ne remove ki hain!
      for (const imageUrl of imagesToDelete) {
        const publicId = extractPublicId(imageUrl);
        await cloudinary.uploader
          .destroy(publicId)
          .catch((err) => console.log("Cloudinary Delete Warning:", err));
        console.log(`Smart Edit: Deleted old image -> ${publicId}`);
      }
    } else {
      // Agar kisi wajah se images array nahi aaya, toh images ko update hone se rok do
      delete req.body.images;
    }

    // Database mein final update karo
    account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Naya updated data wapis karo
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Account successfully updated!",
      data: account,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update account",
      error: error.message,
    });
  }
};
// ==========================================
// @desc    Ek Single Account ki PURI Details Fetch Karna (Admin)
// @route   GET /api/accounts/admin/:id
// @access  Private (Admin Only)
// ==========================================
const getAccountForAdmin = async (req, res) => {
  try {
    // Yahan hum .select("-password") NAHI lagayenge taake sab details aayen!
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res.status(200).json({ success: true, data: account });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch account",
        error: error.message,
      });
  }
};
// ==========================================
// Module Export (Standard ES5 Export)
// ==========================================
module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  deleteAccount,
  updateAccount,
  getAccountForAdmin,
};
