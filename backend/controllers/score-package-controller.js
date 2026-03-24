const ScorePackage = require("../models/score-package-model");

// ==========================================
// 1. Create a new Score Package
// ==========================================
// @route   POST /api/score-packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const newPackage = await ScorePackage.create(req.body);
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create package",
      error: error.message,
    });
  }
};

// ==========================================
// 2. Get all Score Packages (Public)
// ==========================================
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

// ==========================================
// 3. Get all packages for Admin
// ==========================================
// @route   GET /api/score-packages/admin
// @access  Private/Admin
const getAdminPackages = async (req, res) => {
  try {
    // Admin ko sab (Active + Hidden) nazar aayenge
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

// ==========================================
// 4. Update a Score Package (Edit)
// ==========================================
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
    res.status(500).json({
      success: false,
      message: "Failed to update package",
      error: error.message,
    });
  }
};

// ==========================================
// 5. Delete a Score Package
// ==========================================
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

// ==========================================
// 6. 🟡 NAYA JADOO: Make Popular Logic
// ==========================================
// @desc    Make ONE package "Most Popular" and remove from others
// @route   PUT /api/score-packages/make-popular/:id
// @access  Private/Admin
const makePopularPackage = async (req, res) => {
  try {
    // 1. Sab se pehle DataBase mein jitne bhi packages hain, un sab ka isPopular "false" kar do
    await ScorePackage.updateMany({}, { isPopular: false });

    // 2. Phir sirf us ek package ko "true" karo jiski ID Admin ne bheji hai
    const updatedPackage = await ScorePackage.findByIdAndUpdate(
      req.params.id,
      { isPopular: true },
      { new: true },
    );

    if (!updatedPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    res.status(200).json({
      success: true,
      message: "Package marked as Most Popular successfully",
      data: updatedPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update popular status",
      error: error.message,
    });
  }
};

// ==========================================
// Export All Functions
// ==========================================
module.exports = {
  createPackage,
  getAllPackages,
  getAdminPackages,
  updatePackage,
  deletePackage,
  makePopularPackage, // 🟡 EXPORTED
};
