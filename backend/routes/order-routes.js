const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
  getMyOrders,
  deleteOrder,
  getDashboardStats,
} = require("../controllers/order-controller");

const { protect, admin } = require("../middleware/auth-middleware");
router.get("/stats/dashboard", protect, admin, getDashboardStats);
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/track/:id", trackOrder);

router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder); // NAYA RASTA

module.exports = router;
