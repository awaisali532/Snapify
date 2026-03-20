const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // NAYA JADOO: Order ki pehchan (Account ya Boosting)
    orderType: {
      type: String,
      enum: ["Account", "Boosting"],
      default: "Account",
      required: true,
    },
    // Khareedar (Buyer) ki Details
    buyerName: {
      type: String,
      required: [true, "Buyer name is required"],
      trim: true,
    },
    buyerPhone: {
      type: String,
      required: [true, "WhatsApp/Phone number is required"],
    },
    buyerEmail: {
      type: String,
      trim: true,
    },
    // =====================================
    // CONDITIONAL FIELDS (Jadoo Yahan Hai)
    // =====================================
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: function () {
        return this.orderType === "Account";
      },
    },
    scorePackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScorePackage",
      required: function () {
        return this.orderType === "Boosting";
      },
    },
    snapchatUsername: {
      type: String,
      required: function () {
        return this.orderType === "Boosting";
      },
    },
    snapchatPassword: {
      type: String,
      required: function () {
        return this.orderType === "Boosting";
      },
    },
    // =====================================
    // Paison ki Details
    priceAtPurchase: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: [
        "JazzCash",
        "EasyPaisa",
        "SadaPay",
        "Binance",
        "International Bank",
      ],
    },
    paymentScreenshot: {
      type: String,
      required: [true, "Payment screenshot is required for verification"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Verified", "Rejected"], // 'In Progress' added
      default: "Pending",
    },
    isVisibleToAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
