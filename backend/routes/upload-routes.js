const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");

// ==========================================
// 1. SINGLE IMAGE ROUTE (For Accounts & Receipts)
// Yeh zaroori hai taake checkout system kharab na ho
// ==========================================
router.post("/", upload.multi("image"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Koi file upload nahi hui!" });
    }

    // Frontend ko sirf ek URL wapis jayega
    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error("Single Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Image upload fail ho gayi!" });
  }
});

// ==========================================
// 2. MULTIPLE IMAGES ROUTE (For Reviews)
// Reviews mein max 2 screenshots allow kiye hain taake storage bache
// ==========================================
router.post("/multiple", upload.array("images", 2), (req, res) => {
  try {
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
