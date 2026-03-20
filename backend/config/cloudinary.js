const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// 1. Cloudinary ko .env wali chabiyan dena
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage set karna (Dynamic Godaam ka pata)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // NAYA JADOO: 3 raaste ban gaye hain (Receipts, Reviews, ya Accounts)
    let folderName = "snapify_accounts"; // Default

    if (req.query.folder === "receipts") {
      folderName = "snapify_receipts";
    } else if (req.query.folder === "reviews") {
      folderName = "snapify_reviews"; // Naya VIP Folder!
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

// 3. Multer Daakiya tayar karna
const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
