const express = require("express");
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getAdminPackages,
  updatePackage,
  deletePackage,
} = require("../controllers/score-package-controller");
const { protect, admin } = require("../middleware/auth-middleware");

// Public route (Frontend packages dikhane ke liye)
router.get("/", getAllPackages);

// Admin route (Hidden packages bhi dekhne ke liye)
router.get("/admin", protect, admin, getAdminPackages);

// Admin only routes (Add, Edit, Delete)
router.post("/", protect, admin, createPackage);
router.put("/:id", protect, admin, updatePackage);
router.delete("/:id", protect, admin, deletePackage);

module.exports = router;
