const mongoose = require("mongoose");

const scorePackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required (e.g., Gold Boost)"],
      trim: true,
    },
    scoreAmount: {
      type: Number,
      required: [true, "Target score amount is required (e.g., 100000)"],
    },
    price: {
      type: Number,
      required: [true, "Original price is required"],
    },
    deliveryTime: {
      type: String,
      required: [true, "Delivery time is required (e.g., 2-3 Days)"],
    },

    isOffer: {
      type: Boolean,
      default: false,
    },
    offerPrice: {
      type: Number,
      default: 0,
    },

    features: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ScorePackage", scorePackageSchema);
