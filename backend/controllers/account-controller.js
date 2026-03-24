const Account = require("../models/account-model");
const { cloudinary } = require("../config/cloudinary");

// ==========================================
// HELPER: URL se Public ID nikalne ka Jadoo
// ==========================================
const extractPublicId = (imageUrl) => {
  const parts = imageUrl.split("/");
  const filename = parts.pop();
  const folder = parts.pop();
  return `${folder}/${filename.split(".")[0]}`;
};

// ==========================================
// 1. Create Account
// ==========================================
const createAccount = async (req, res) => {
  try {
    // 🟡 JADOO: Agar date empty aayi hai toh usey null kar do (Taake aaj ki date auto na lage)
    if (!req.body.creationDate || req.body.creationDate === "") {
      req.body.creationDate = null;
    }

    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();

    res.status(201).json({
      success: true,
      message: "Account successfully created",
      data: savedAccount,
    });
  } catch (error) {
    console.error("Database Save Failed! Running Rollback... 🚨");

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
// 2. Delete Account
// ==========================================
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    if (account.images && account.images.length > 0) {
      for (const imageUrl of account.images) {
        const publicId = extractPublicId(imageUrl);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await account.deleteOne();
    res
      .status(200)
      .json({
        success: true,
        message: "Account and images completely deleted!",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete account",
        error: error.message,
      });
  }
};

// ==========================================
// 3. Get All Accounts (Public)
// ==========================================
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ isSold: false }).select(
      "-snapchatUsername -snapchatPassword -recoveryEmail -emailPassword",
    );
    res
      .status(200)
      .json({ success: true, count: accounts.length, data: accounts });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch accounts",
        error: error.message,
      });
  }
};

// ==========================================
// 4. Get Single Account By ID (Public)
// ==========================================
const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).select(
      "-snapchatUsername -snapchatPassword -recoveryEmail -emailPassword",
    );

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
        message: "Failed to fetch account details",
        error: error.message,
      });
  }
};

// ==========================================
// 5. Update Account
// ==========================================
const updateAccount = async (req, res) => {
  try {
    let account = await Account.findById(req.params.id);

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // 🟡 JADOO: Agar update karte waqt date khali chhor di, toh usey null save karo
    if (req.body.creationDate === "") {
      req.body.creationDate = null;
    }

    if (req.body.images && Array.isArray(req.body.images)) {
      const existingImages = account.images || [];
      const incomingImages = req.body.images;

      const imagesToDelete = existingImages.filter(
        (img) => !incomingImages.includes(img),
      );

      for (const imageUrl of imagesToDelete) {
        const publicId = extractPublicId(imageUrl);
        await cloudinary.uploader
          .destroy(publicId)
          .catch((err) => console.log(err));
      }
    } else {
      delete req.body.images;
    }

    account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Account successfully updated!",
        data: account,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update account",
        error: error.message,
      });
  }
};

// ==========================================
// 6. Get Account For Admin
// ==========================================
const getAccountForAdmin = async (req, res) => {
  try {
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

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  deleteAccount,
  updateAccount,
  getAccountForAdmin,
};
