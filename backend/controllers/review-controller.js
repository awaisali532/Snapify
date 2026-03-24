const Review = require("../models/review-model");
const Order = require("../models/order-model");
const cloudinary = require("cloudinary").v2;

// Helper Function: Cloudinary se tasweer delete karne ke liye
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
// 1. User khud review add karega
// ==========================================
const createReview = async (req, res) => {
  try {
    const { rating, comment, images, socialLink } = req.body;

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

    const alreadyReviewed = await Review.findOne({ user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review. Thank you!",
      });
    }

    const review = new Review({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
      socialLink: socialLink || "",
      images: images || [],
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
// 2. Admin khud custom review add karega
// ==========================================
const addCustomReview = async (req, res) => {
  try {
    const {
      name,
      rating,
      comment,
      images,
      isVerifiedPurchase,
      createdAt,
      socialLink,
    } = req.body;

    const reviewData = {
      name,
      rating,
      comment,
      socialLink: socialLink || "",
      images: images || [],
      isVerifiedPurchase:
        isVerifiedPurchase !== undefined ? isVerifiedPurchase : true,
    };

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
// 3. Website ke liye saare reviews fetch karna
// ==========================================
const getAllReviews = async (req, res) => {
  try {
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
// 4. Admin review update karega (NAYA JADOO ✏️)
// ==========================================
const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Date fix: Agar empty string aayi toh Mongoose error na de
    if (req.body.createdAt === "") {
      delete req.body.createdAt;
    }

    // Smart Image Sync: Agar user ne purani tasweer cross kardi toh usay Cloudinary se uda do
    if (req.body.images && Array.isArray(req.body.images)) {
      const existingImages = review.images || [];
      const incomingImages = req.body.images;

      const imagesToDelete = existingImages.filter(
        (img) => !incomingImages.includes(img),
      );

      for (const imageUrl of imagesToDelete) {
        const publicId = extractPublicId(imageUrl);
        if (publicId)
          await cloudinary.uploader
            .destroy(publicId)
            .catch((err) => console.log(err));
      }
    } else {
      delete req.body.images; // Agar images array mein nahi aaye toh isey ignore karo
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ==========================================
// 5. Admin ghalat reviews delete karega
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

    if (review.images && review.images.length > 0) {
      for (const imgUrl of review.images) {
        const publicId = extractPublicId(imgUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

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
  updateReview, // 🟡 Export Update Function
  deleteReview,
};
