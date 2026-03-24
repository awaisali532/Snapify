const express = require("express");
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getAdminPackages,
  updatePackage,
  deletePackage,
  makePopularPackage,
} = require("../controllers/score-package-controller");
const { protect, admin } = require("../middleware/auth-middleware");

router.get("/", getAllPackages);

router.get("/admin", protect, admin, getAdminPackages);

router.put("/make-popular/:id", protect, admin, makePopularPackage);

router.post("/", protect, admin, createPackage);
router.put("/:id", protect, admin, updatePackage);
router.delete("/:id", protect, admin, deletePackage);

module.exports = router;
