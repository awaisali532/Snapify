import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaImage,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { CurrencyContext } from "../../context/CurrencyContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
    socialLink: "",
  });
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { currency, symbols, calculatePrice } = useContext(CurrencyContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyOrders();
  }, [user, navigate]);

  const fetchMyOrders = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching my orders:", error);
      Swal.fire("Error", "Could not load your orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Copied to clipboard!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const displaySymbol = symbols[currency] || "Rs";

  const submitReview = async (e) => {
    // Review logic unchanged...
    e.preventDefault();
    if (!reviewData.comment.trim())
      return Swal.fire("Oops", "Please write a comment!", "warning");

    setIsSubmittingReview(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      let uploadedImageUrls = [];

      if (reviewImages.length > 0) {
        const formData = new FormData();
        Array.from(reviewImages).forEach((file) =>
          formData.append("images", file),
        );
        const uploadRes = await axios.post(
          `${API_URL}/api/upload/multiple?folder=reviews`,
          formData,
        );
        uploadedImageUrls = uploadRes.data.urls;
      }

      await axios.post(
        `${API_URL}/api/reviews`,
        {
          rating: reviewData.rating,
          comment: reviewData.comment,
          socialLink: reviewData.socialLink,
          images: uploadedImageUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire("Thank You! 🎉", "Your review has been published.", "success");
      setShowReviewModal(false);
      setReviewImages([]);
      setReviewData({ rating: 5, comment: "" });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to submit review",
        "error",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-snap-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-snap-dark py-12 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
              My Orders 📦
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              View your order history, payment status, and account credentials.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center flex flex-col items-center">
            <FaBoxOpen className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't bought any items yet.
            </p>
            <button
              onClick={() => navigate("/accounts")}
              className="bg-snap-yellow text-black font-bold px-6 py-3 rounded-xl hover:shadow-lg transition"
            >
              Browse Accounts
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md"
                >
                  <div
                    className={`px-6 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${
                      order.status === "Verified"
                        ? "bg-green-50 dark:bg-green-900/10"
                        : order.status === "Rejected"
                          ? "bg-red-50 dark:bg-red-900/10"
                          : order.status === "In Progress"
                            ? "bg-blue-50 dark:bg-blue-900/10"
                            : "bg-yellow-50 dark:bg-yellow-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {order.status === "Pending" && (
                        <FaClock className="text-yellow-500 animate-pulse" />
                      )}
                      {order.status === "Verified" && (
                        <FaCheckCircle className="text-green-500" />
                      )}
                      {order.status === "Rejected" && (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      {/* NAYA JADOO: Processing ke liye Blue clock */}
                      {order.status === "In Progress" && (
                        <FaClock className="text-blue-500 animate-pulse" />
                      )}

                      <span
                        className={`font-black uppercase tracking-wider text-sm ${
                          order.status === "Verified"
                            ? "text-green-700 dark:text-green-400"
                            : order.status === "Rejected"
                              ? "text-red-700 dark:text-red-400"
                              : order.status === "In Progress"
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {/* NAYA JADOO: User ko Completed dikhao */}
                        {order.status === "Verified" &&
                        order.orderType === "Boosting"
                          ? "Completed"
                          : order.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-full">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 flex items-center gap-2">
                        {order.orderType === "Boosting"
                          ? order.scorePackage
                            ? order.scorePackage.title
                            : "Boosting Package"
                          : order.account
                            ? order.account.title
                            : "Account Details Unavailable"}
                        {order.orderType === "Boosting" && (
                          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-[10px] px-2 py-0.5 rounded-full uppercase">
                            Boost
                          </span>
                        )}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Ordered on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded">
                        Paid via {order.paymentMethod}
                      </span>
                    </div>

                    <div className="md:text-right w-full md:w-auto flex justify-between md:flex-col items-center md:items-end">
                      <div>
                        <p className="text-2xl font-black text-snap-dark dark:text-snap-yellow">
                          {displaySymbol}{" "}
                          {calculatePrice(order.priceAtPurchase)}
                        </p>
                      </div>

                      <div className="flex gap-4 mt-2">
                        {order.status === "Verified" && (
                          <button
                            onClick={() => setShowReviewModal(true)}
                            className="flex items-center gap-1 text-sm font-bold text-yellow-500 hover:text-yellow-600 transition"
                          >
                            <FaStar /> Leave a Review
                          </button>
                        )}

                        {(order.status === "Verified" ||
                          order.status === "In Progress") &&
                          (order.orderType === "Boosting" || order.account) && (
                            <button
                              onClick={() => toggleExpand(order._id)}
                              className="flex items-center gap-2 text-sm font-bold text-yellow-600 dark:text-snap-yellow hover:text-yellow-500 dark:hover:text-yellow-400 transition"
                            >
                              {isExpanded ? "Hide Details" : "View Details"}
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* CREDENTIALS VAULT */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {(order.status === "Verified" ||
                      order.status === "In Progress") &&
                      (order.orderType === "Boosting" || order.account) && (
                        <div className="px-6 py-5 bg-green-50/50 dark:bg-green-900/5 border-t border-green-100 dark:border-green-800/30">
                          <h4 className="text-sm font-black text-green-600 dark:text-green-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <FaCheckCircle />{" "}
                            {order.orderType === "Boosting"
                              ? "Target Account Details"
                              : "Your Secret Credentials"}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* BOOSTING DETAILS */}
                            {order.orderType === "Boosting" ? (
                              <div className="bg-white dark:bg-snap-dark p-4 rounded-xl border border-green-200 dark:border-green-800/50 relative">
                                <p className="text-xs text-gray-400 uppercase">
                                  Target Username
                                </p>
                                <p className="font-mono font-bold text-gray-900 dark:text-white">
                                  {order.snapchatUsername}
                                </p>
                                <p className="text-xs text-gray-400 uppercase mt-2">
                                  Password Provided
                                </p>
                                <p className="font-mono font-bold text-gray-900 dark:text-white">
                                  •••••••• (Hidden for security)
                                </p>
                              </div>
                            ) : (
                              /* ACCOUNT BUY DETAILS */
                              <>
                                <div className="bg-white dark:bg-snap-dark p-4 rounded-xl border border-green-200 dark:border-green-800/50 relative">
                                  <p className="text-xs text-gray-400 uppercase">
                                    Snap Username
                                  </p>
                                  <p className="font-mono font-bold text-gray-900 dark:text-white">
                                    {order.account.snapchatUsername}
                                  </p>
                                  <p className="text-xs text-gray-400 uppercase mt-2">
                                    Snap Password
                                  </p>
                                  <p className="font-mono font-bold text-gray-900 dark:text-white">
                                    {order.account.snapchatPassword}
                                  </p>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        `Username: ${order.account.snapchatUsername}\nPassword: ${order.account.snapchatPassword}`,
                                      )
                                    }
                                    className="absolute top-4 right-4 text-gray-400 hover:text-snap-yellow"
                                  >
                                    <FaCopy size={18} />
                                  </button>
                                </div>

                                {(order.account.recoveryEmail ||
                                  order.account.emailPassword) && (
                                  <div className="bg-white dark:bg-snap-dark p-4 rounded-xl border border-green-200 dark:border-green-800/50 relative">
                                    <div className="mb-2">
                                      <p className="text-xs text-gray-400 uppercase">
                                        Recovery Email
                                      </p>
                                      <p className="font-mono font-bold text-gray-900 dark:text-white truncate pr-6">
                                        {order.account.recoveryEmail || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400 uppercase">
                                        Email Password
                                      </p>
                                      <p className="font-mono font-bold text-gray-900 dark:text-white">
                                        {order.account.emailPassword || "N/A"}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          `Email: ${order.account.recoveryEmail}\nPassword: ${order.account.emailPassword}`,
                                        )
                                      }
                                      className="absolute top-4 right-4 text-gray-400 hover:text-snap-yellow transition"
                                    >
                                      <FaCopy size={18} />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REVIEW MODAL YAHAN HAI */}
        {showReviewModal && (
          // Review Modal Code unchanged... (Same as before)
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white dark:bg-snap-card rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FaTimesCircle size={24} />
              </button>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                Rate Your Experience ⭐️
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Your review helps others trust us. You can also upload chat
                screenshots!
              </p>
              <form onSubmit={submitReview} className="space-y-4">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={32}
                      className={`cursor-pointer transition ${star <= reviewData.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"}`}
                      onClick={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Your Comment
                  </label>
                  <textarea
                    rows="3"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none"
                    placeholder="E.g., Got the account in 5 minutes! Trusted seller."
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Your Social Link (Optional)
                  </label>
                  <input
                    type="url"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none"
                    placeholder="e.g., https://wa.me/923... or FB/Insta link"
                    value={reviewData.socialLink}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        socialLink: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Let others contact you to verify your purchase!
                  </p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <FaImage /> Add Screenshots (Max 2)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length > 2) {
                        Swal.fire(
                          "Limit Exceeded",
                          "You can only upload up to 2 screenshots.",
                          "warning",
                        );
                        e.target.value = null;
                      } else {
                        setReviewImages(e.target.files);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 dark:file:bg-yellow-900/20 dark:file:text-yellow-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-snap-yellow hover:bg-yellow-500 text-black font-black py-3 rounded-xl transition flex justify-center items-center gap-2 mt-4"
                >
                  {isSubmittingReview ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-b-2 border-black rounded-full"></span>{" "}
                      Publishing...
                    </>
                  ) : (
                    "Publish Review"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
