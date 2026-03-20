const PaymentMethod = require("../models/payment-method-model");

// Public API: Sirf Active methods fetch karne ke liye (Checkout page ke liye)
const getActivePaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ isActive: true });
    res.status(200).json({ success: true, data: methods });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment methods" });
  }
};

// Admin API: Sab methods fetch karne ke liye
const getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.status(200).json({ success: true, data: methods });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment methods" });
  }
};

// Admin API: Naya method bananay ke liye
const createPaymentMethod = async (req, res) => {
  try {
    const newMethod = await PaymentMethod.create(req.body);
    res.status(201).json({ success: true, data: newMethod });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create payment method" });
  }
};

// Admin API: Update karne ke liye
const updatePaymentMethod = async (req, res) => {
  try {
    const updatedMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json({ success: true, data: updatedMethod });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update payment method" });
  }
};

// Admin API: Delete karne ke liye
const deletePaymentMethod = async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Payment method deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete payment method" });
  }
};

module.exports = {
  getActivePaymentMethods,
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
