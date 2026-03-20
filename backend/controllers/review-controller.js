const Review = require("../models/review-model");
const Order = require("../models/order-model");
const cloudinary = require("cloudinary").v2;

// Helper Function: Cloudinary se tasweer delete karne ke liye (jab review delete ho)
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const file = parts.pop().split(".")[0];
    const folder = parts.pop();
    return `${folder}/${file}`;
  } catch (error) {
    return null;
  }
};

// ==========================================
// 1. User khud review add karega (Sirf Verified Order wale)
// ==========================================
const createReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    // Check: Kya is user ka koi Verified order mojood hai?
    const hasVerifiedOrder = await Order.findOne({
      user: req.user._id,
      status: "Verified",
    });

    if (!hasVerifiedOrder) {
      return res.status(403).json({
        success: false,
        message: "You must purchase and verify an account to leave a review.",
      });
    }

    // Check: Kya isne pehle hi review de diya hai? (1 user = 1 review allow hai)
    const alreadyReviewed = await Review.findOne({ user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review. Thank you!",
      });
    }

    const review = new Review({
      user: req.user._id,
      name: req.user.name, // User collection se naam utha liya
      rating,
      comment,
      images: images || [], // NAYA: WhatsApp/Payment screenshots
      isVerifiedPurchase: true,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// ==========================================
// 2. Admin khud custom review add karega (Past Date support ke sath)
// ==========================================
const addCustomReview = async (req, res) => {
  try {
    const { name, rating, comment, images, isVerifiedPurchase, createdAt } =
      req.body;

    const reviewData = {
      name,
      rating,
      comment,
      images: images || [],
      isVerifiedPurchase:
        isVerifiedPurchase !== undefined ? isVerifiedPurchase : true,
    };

    // NAYA JADOO: Agar admin ne purani date bheji hai, toh wo lagao, warna aaj ki auto lag jayegi
    if (createdAt) {
      reviewData.createdAt = new Date(createdAt);
    }

    const review = new Review(reviewData);

    await review.save();

    res.status(201).json({
      success: true,
      message: "Custom review added successfully by Admin!",
      data: review,
    });
  } catch (error) {
    console.error("Add Custom Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add custom review",
      error: error.message,
    });
  }
};
// ==========================================
// 3. Website ke liye saare reviews fetch karna (Public)
// ==========================================
const getAllReviews = async (req, res) => {
  try {
    // Sab se naye reviews sab se pehle aayenge
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// ==========================================
// 4. Admin ghalat reviews delete karega (Aur images bhi saaf karega)
// ==========================================
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // NAYA JADOO: Agar review mein screenshots hain, toh unko Cloudinary se delete karo
    if (review.images && review.images.length > 0) {
      for (const imgUrl of review.images) {
        const publicId = extractPublicId(imgUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    // Database se review uda do
    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review and its images deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  createReview,
  addCustomReview,
  getAllReviews,
  deleteReview,
};
