const mongoose = require("mongoose");

// 1. Schema (Saancha) Define Karna
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },

    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true, // Ek username do logon ka nahi ho sakta
      trim: true,
      lowercase: true, // "Ali" aur "ali" ko same treat karega taake koi duplicate na bana le
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      trim: true,
      lowercase: true,
      // THE PRO-LEVEL GMAIL ONLY CHECK
      match: [
        /^[a-zA-Z0-9.]+@gmail\.com$/,
        "Temp mails are not allowed. Please use a valid @gmail.com address.",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Role sirf in do mein se ek ho sakta hai
      default: "user", // Jab naya account banega, automatically 'user' hoga
    },
    isVerified: {
      type: Boolean,
      default: false, // Email verify hone tak false rahega
    },
  },
  {
    timestamps: true, // 2. Automatically createdAt aur updatedAt dates add kar dega
  },
);

// 3. Model Export Karna
const User = mongoose.model("User", userSchema);
module.exports = User;
