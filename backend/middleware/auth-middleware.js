const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // Apne User model ka path check kar lijiyega

// ==========================================
// 🛡️ GUARD 1: Check if user is Logged In
// ==========================================
const protect = async (req, res, next) => {
  let token;

  // Check karte hain ke kya headers mein Authorization Bearer token mojood hai?
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // "Bearer eyJhbGci..." mein se sirf token nikalna (split array ka 1 index)
      token = req.headers.authorization.split(" ")[1];

      // Token ko verify karna (Aapne .env mein jo bhi JWT_SECRET rakha hai)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token mein se id nikal kar database se user dhoondo aur req.user mein daal do
      // .select('-password') ka matlab hai password req.user mein nahi aana chahiye
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Sab theek hai, aage jane do
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

// ==========================================
// 👑 GUARD 2: Check if user is Admin
// ==========================================
const admin = (req, res, next) => {
  // protect middleware ne req.user set kar diya tha, ab hum uska role check karenge
  if (req.user && req.user.role === "admin") {
    next(); // Agar admin hai toh aage jane do
  } else {
    res
      .status(403)
      .json({ success: false, message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
