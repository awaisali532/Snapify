import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaStar,
  FaCheckCircle,
  FaImage,
  FaQuoteLeft,
  FaCommentDots,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicReviews = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/reviews`);

        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicReviews();
  }, []);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : "5.0";

  const viewImage = (url) => {
    Swal.fire({
      imageUrl: url,
      imageWidth: "100%",
      imageAlt: "Review Screenshot",
      confirmButtonColor: "#eab308", // yellow-500
      confirmButtonText: "Close",
      background: "#1f2937",
      color: "#fff",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-snap-dark">
        {/* 🟡 LOADER COLOR FIXED HERE */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-snap-dark py-16 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Don't just take{" "}
            <span className="text-yellow-500 dark:text-snap-yellow">
              our word
            </span>{" "}
            for it.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
            Read real reviews from {totalReviews > 0 ? totalReviews : "our"}{" "}
            happy customers who bought their dream Snapchat accounts from us.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white dark:bg-snap-card px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                {averageRating}
              </span>
              <div className="flex text-yellow-500 dark:text-snap-yellow">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="text-gray-500 text-sm font-bold ml-1">
                Average Rating
              </span>
            </div>
            <div className="bg-white dark:bg-snap-card px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="text-gray-900 dark:text-white font-bold">
                100% Trusted Seller
              </span>
            </div>
          </div>
        </div>

        {/* REVIEWS GRID */}
        {reviews.length === 0 ? (
          <div className="text-center bg-white dark:bg-snap-card rounded-3xl p-12 border border-gray-100 dark:border-gray-800">
            <FaQuoteLeft className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-500">
              Be the first one to leave a review after purchasing an account!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-snap-card rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 relative hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full"
              >
                <FaQuoteLeft className="absolute top-6 right-6 text-4xl text-gray-100 dark:text-gray-800/50" />

                <div className="flex mb-4 relative z-10">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < review.rating
                          ? "text-yellow-500 dark:text-snap-yellow"
                          : "text-gray-300 dark:text-gray-700"
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed relative z-10 grow">
                  "{review.comment}"
                </p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-3 mb-6 relative z-10">
                    {review.images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => viewImage(img)}
                        className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-500 dark:hover:border-snap-yellow transition"
                      >
                        <img
                          src={img}
                          alt="Proof"
                          className="w-16 h-16 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <FaImage className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <hr className="border-gray-100 dark:border-gray-800 mb-4" />

                {/* USER INFO & CONTACT BUTTON */}
                <div className="flex justify-between items-center mt-auto relative z-10">
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                      {review.name}
                      {review.isVerifiedPurchase && (
                        <FaCheckCircle
                          className="text-green-500 text-sm"
                          title="Verified Purchase"
                        />
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* 🟡 BUTTON HOVER COLORS FIXED FOR LIGHT & DARK MODE */}
                  {review.socialLink && (
                    <a
                      href={review.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-yellow-500 dark:hover:bg-snap-yellow text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-black py-2 px-4 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                      title="Contact this buyer to verify"
                    >
                      <FaCommentDots className="text-sm" /> Ask Me
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
