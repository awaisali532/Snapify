const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/user-controller");

// 1. Register Route
router.post("/register", registerUser);

// 2. Login Route
router.post("/login", loginUser);

module.exports = router;
