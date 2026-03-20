const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    // ==========================================
    // 🟢 PUBLIC DATA (Jo website par sab ko nazar aayega)
    // ==========================================
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    followers: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Any"],
      required: true,
    },
    images: [
      { type: String }, // Tasveeron ke links ka array
    ],
    features: [
      { type: String }, // "Instant Delivery", "Organic" waghaira
    ],
    creationDate: {
      type: Date,
      default: Date.now, // Account kab banaya gaya tha
    },
    // ==========================================
    // 🔴 SECRET DATA (Jo sirf khareedari ke baad dikhega)
    // ==========================================
    snapchatUsername: {
      type: String,
      required: true,
    },
    snapchatPassword: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
    },
    emailPassword: {
      type: String,
      required: true,
    },

    // ==========================================
    // ⚙️ SYSTEM DATA (Status aur Admin tracking)
    // ==========================================
    isSold: {
      type: Boolean,
      default: false, // Jab account banega toh zahir hai bika nahi hoga
    },
    // Kis admin ne yeh account upload kiya tha? (Future tracking ke liye best)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
); // timestamps true karne se createdAt aur updatedAt khud ban jayenge

module.exports = mongoose.model("Account", accountSchema);
