const express = require("express");
const router = express.Router();
const {
  getActivePaymentMethods,
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/payment-method-controller");
const { protect, admin } = require("../middleware/auth-middleware");

router.get("/", getActivePaymentMethods); // Public
router.get("/admin", protect, admin, getAllPaymentMethods); // Admin
router.post("/", protect, admin, createPaymentMethod);
router.put("/:id", protect, admin, updatePaymentMethod);
router.delete("/:id", protect, admin, deletePaymentMethod);

module.exports = router;
