const express = require("express");
const router = express.Router();

const {
  createReview,
  addCustomReview,
  getAllReviews,
  updateReview, // 🟡 Import kiya
  deleteReview,
} = require("../controllers/review-controller");

const { protect, admin } = require("../middleware/auth-middleware");

// Public Route (Homepage aur Reviews page ke liye)
router.get("/", getAllReviews);

// Logged-in User Route (My Orders se review dene ke liye)
router.post("/", protect, createReview);

// Admin Routes (Custom add, edit, aur delete karne ke liye)
router.post("/admin", protect, admin, addCustomReview);
router.put("/:id", protect, admin, updateReview); // 🟡 NAYA ROUTE EDIT KE LIYE
router.delete("/:id", protect, admin, deleteReview);

module.exports = router;
