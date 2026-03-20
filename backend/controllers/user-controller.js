const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Yeh laazmi import karna hai top par
// ==========================================
// 1. REGISTER NEW USER FUNCTION
// ==========================================
const registerUser = async (req, res) => {
  try {
    // 1. Frontend se aane wali 4 cheezein pakro
    const { name, username, email, password } = req.body;

    // 2. Validation: Check karo koi field khali toh nahi?
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields (name, username, email, password)",
      });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
      });
    }

    // 3. THE PRO-LEVEL DB CHECK ($or operator)
    // Check karo ke database mein is 'email' YA 'username' ka koi banda pehle se mojood toh nahi?
    const userExists = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (userExists) {
      // Hum backend se exact bata sakte hain ke masla email mein hai ya username mein
      if (userExists.email === email) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }
      if (userExists.username === username) {
        return res
          .status(400)
          .json({ message: "This username is already taken" });
      }
    }

    // 4. Security: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Naya user Database mein save karo
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // 6. Success Response
    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        message: "User registered successfully! 🚀",
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    // Mongoose validation errors (jaise password regex fail hona) yahan pakre jayenge
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. LOGIN USER (Specific Errors)
// ==========================================
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Validation
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please enter your Email/Username and Password" });
    }

    // 2. Check karna ke user ne email daali hai ya username (trick: check for '@')
    const isEmail = identifier.includes("@gmail.com");

    // 3. Database se dhoondo
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier.toLowerCase() }],
    });

    // 4. SPECIFIC ERROR #1: Agar user database mein mila hi nahi
    if (!user) {
      if (isEmail) {
        // Agar usne email likhi thi aur nahi mili
        return res
          .status(404)
          .json({ message: "No account found with this email address." });
      } else {
        // Agar usne username likha tha aur nahi mila
        return res
          .status(404)
          .json({ message: "This username does not exist." });
      }
    }

    // 5. SPECIFIC ERROR #2: User mil gaya, lekin password check karo
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // Password ghalat hai
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again." });
    }

    // 6. SUCCESS: Sab theek hai, Token de do
    res.json({
      _id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. GENERATE JWT TOKEN (The Ticket Maker)
// ==========================================
const generateToken = (id) => {
  // jwt.sign 3 cheezein leta hai: Payload (ID), Secret Key, aur Expiry Time
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // 30 din baad token expire ho jayega aur user ko dobara login karna padega
  });
};

// Exporting both functions
module.exports = {
  registerUser, // Jo upar banaya tha
  loginUser,
};
