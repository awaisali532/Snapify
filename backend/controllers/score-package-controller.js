const ScorePackage = require("../models/score-package-model");

// @desc    Create a new Score Package
// @route   POST /api/score-packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const newPackage = await ScorePackage.create(req.body);
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create package",
        error: error.message,
      });
  }
};

// @desc    Get all Score Packages (Public)
// @route   GET /api/score-packages
// @access  Public
const getAllPackages = async (req, res) => {
  try {
    // Sirf active packages frontend par jayenge
    const packages = await ScorePackage.find({ isActive: true }).sort({
      scoreAmount: 1,
    });
    res
      .status(200)
      .json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch packages" });
  }
};

// @desc    Get all packages for Admin (Includes hidden ones)
// @route   GET /api/score-packages/admin
// @access  Private/Admin
const getAdminPackages = async (req, res) => {
  try {
    const packages = await ScorePackage.find().sort({ scoreAmount: 1 });
    res
      .status(200)
      .json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin packages" });
  }
};

// @desc    Update a Score Package (Offer lagana ya price badalna)
// @route   PUT /api/score-packages/:id
// @access  Private/Admin
const updatePackage = async (req, res) => {
  try {
    const updatedPackage = await ScorePackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, data: updatedPackage });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update package",
        error: error.message,
      });
  }
};

// @desc    Delete a Score Package
// @route   DELETE /api/score-packages/:id
// @access  Private/Admin
const deletePackage = async (req, res) => {
  try {
    const pkg = await ScorePackage.findById(req.params.id);
    if (!pkg) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }
    await pkg.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete package" });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getAdminPackages,
  updatePackage,
  deletePackage,
};
