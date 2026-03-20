const express = require("express");
const router = express.Router();

// Controllers import kiye
const {
  createAccount,
  getAllAccounts,
  getAccountById,
  deleteAccount,
  updateAccount,
  getAccountForAdmin,
} = require("../controllers/account-controller");

// NAYA JADOO: Apne guards import kiye
const { protect, admin } = require("../middleware/auth-middleware");

// ==========================================
// 🌐 PUBLIC ROUTES (Koi bhi dekh sakta hai)
// ==========================================
router.get("/", getAllAccounts);
router.get("/:id", getAccountById);

// ==========================================
// 🛡️ PRIVATE/ADMIN ROUTES (Sirf Admin post/delete kar sakta hai)
// ==========================================
// Guard order: Pehle 'protect' check karega login hai? Phir 'admin' check karega admin hai?
router.post("/", protect, admin, createAccount);

router.delete("/:id", protect, admin, deleteAccount);

router.put("/:id", protect, admin, updateAccount);
router.get("/admin/:id", protect, admin, getAccountForAdmin);

module.exports = router;
