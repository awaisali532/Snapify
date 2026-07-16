const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");

// ==========================================
// 1. SINGLE IMAGE ROUTE (For Receipts/Avatars)
// ==========================================
router.post("/", upload.single("image"), (req, res) => {
  try {
    // FIX 1: upload.single() ke liye req.file (bina 's' ke) use hota hai
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Koi file upload nahi hui!" });
    }

    // Frontend ko sirf ek URL wapis jayega
    res.status(200).json({
      success: true,
      imageUrl: req.file.path, // Yahan bhi req.file aayega
    });
  } catch (error) {
    console.error("Single Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Image upload fail ho gayi!" });
  }
});

// ==========================================
// 2. MULTIPLE IMAGES ROUTE (For Accounts & Reviews)
// ==========================================
// FIX 2: Limit ko 2 se barha kar 5 kar diya taake Add Account theek chale
router.post("/multiple", upload.array("images", 5), (req, res) => {
  try {
    console.log("Route reached");
    console.log(req.files?.length);
    // upload.array() ke liye req.files (plural) use hota hai
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Koi file upload nahi hui!" });
    }

    // Saari tasveeron ke links nikal kar array bana lo
    const imageUrls = req.files.map((file) => file.path);

    // Frontend ko array wapis jayega
    res.status(200).json({
      success: true,
      urls: imageUrls,
    });
  } catch (error) {
    console.error("Multiple Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Images upload fail ho gayi!" });
  }
});

module.exports = router;
