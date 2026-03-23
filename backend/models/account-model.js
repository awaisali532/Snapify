const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    // ==========================================
    // 🟢 PUBLIC DATA
    // ==========================================
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    score: { type: Number, required: true },
    followers: { type: Number, default: 0 },
    gender: { type: String, enum: ["Male", "Female", "Any"], required: true },
    images: [{ type: String }],
    features: [{ type: String }],
    creationDate: { type: Date, default: Date.now },

    // ==========================================
    // 🔴 SECRET DATA
    // ==========================================
    snapchatUsername: { type: String, required: true },
    snapchatPassword: { type: String, required: true },
    recoveryEmail: { type: String, required: true },
    emailPassword: { type: String, required: true },

    // ==========================================
    // ⚙️ SYSTEM DATA (Status aur Admin tracking)
    // ==========================================
    isSold: {
      type: Boolean,
      default: false, // Fully Sold (Payment clear)
    },
    // NAYA JADOO: Reserved Flag
    isReserved: {
      type: Boolean,
      default: false, // Pending Payment wala status
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Account", accountSchema);
