const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    methodName: {
      type: String,
      required: [true, "Method name is required (e.g., JazzCash)"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Display title is required (e.g., JazzCash Transfer)"],
    },
    details: {
      type: String,
      required: [true, "Account details are required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
