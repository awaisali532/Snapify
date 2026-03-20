import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaTrashAlt,
  FaPlusCircle,
  FaStar,
  FaImage,
  FaTimesCircle,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

// NAYA JADOO: LoaderContext import kar liya
import { LoaderContext } from "../../context/LoaderContext";

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // NAYA: Loader Context se functions nikal liye
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // Custom Review Modal States
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customData, setCustomData] = useState({
    name: "",
    rating: 5,
    comment: "",
    createdAt: "",
  });
  const [customImages, setCustomImages] = useState([]);

  const fetchReviews = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/api/reviews`);
      setReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // DELETE REVIEW (Loader Add Kiya)
  const handleDelete = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Delete Review?",
      text: "This will remove the review and its images permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (!isConfirm.isConfirmed) return;

    // NAYA: Loader Show Karo
    showLoader("Deleting Review...");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Deleted!", "Review removed.", "success");
      fetchReviews();
    } catch (error) {
      Swal.fire("Error", "Failed to delete review", "error");
    } finally {
      // NAYA: Loader Hide Karo
      hideLoader();
    }
  };

  // ADD CUSTOM REVIEW (Admin) - Loader Add Kiya
  const submitCustomReview = async (e) => {
    e.preventDefault();
    if (!customData.name || !customData.comment)
      return Swal.fire("Oops", "Name and comment required!", "warning");

    setIsSubmitting(true);
    // NAYA: Loader Show Karo (Custom message ke sath)
    showLoader("Uploading & Publishing...");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      let uploadedImageUrls = [];

      if (customImages.length > 0) {
        const formData = new FormData();
        Array.from(customImages).forEach((file) =>
          formData.append("images", file),
        );
        const uploadRes = await axios.post(
          `${API_URL}/api/upload/multiple?folder=reviews`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        uploadedImageUrls = uploadRes.data.urls;
      }

      await axios.post(
        `${API_URL}/api/reviews/admin`,
        { ...customData, images: uploadedImageUrls },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire("Added!", "Custom review is live.", "success");
      setShowModal(false);
      setCustomImages([]);
      setCustomData({ name: "", rating: 5, comment: "", createdAt: "" });
      fetchReviews();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add custom review", "error");
    } finally {
      setIsSubmitting(false);
      // NAYA: Loader Hide Karo
      hideLoader();
    }
  };

  const viewImage = (url) => {
    Swal.fire({
      imageUrl: url,
      imageWidth: 400,
      confirmButtonColor: "#facc15",
    });
  };

  // Initial Data Load Loader
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Manage Reviews ⭐️
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Control public feedback and add custom testimonials.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-snap-dark dark:bg-snap-yellow text-white dark:text-black font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-sm"
        >
          <FaPlusCircle /> Add Custom Review
        </button>
      </div>

      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Rating
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Comment
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Images
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No reviews found. Click "Add Custom Review" to get started.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition"
                  >
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      {r.name}{" "}
                      {r.isVerifiedPurchase && (
                        <FaCheckCircle
                          className="inline text-green-500 ml-1"
                          title="Verified"
                        />
                      )}
                    </td>
                    <td className="p-4 text-yellow-500 flex mt-1 items-center">
                      {[...Array(r.rating)].map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {r.comment}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {r.images && r.images.length > 0 ? (
                          r.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => viewImage(img)}
                              className="text-snap-yellow hover:text-yellow-600 transition"
                              title="View Screenshot"
                            >
                              <FaImage size={22} />
                            </button>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Delete Review"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-10">
          <div className="bg-white dark:bg-snap-card rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimesCircle size={24} />
            </button>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Add Local Deal Review
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Manually add reviews for customers who bought from you via
              WhatsApp or Facebook.
            </p>

            <form onSubmit={submitCustomReview} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Buyer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ali Raza"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
                  value={customData.name}
                  onChange={(e) =>
                    setCustomData({ ...customData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className=" text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FaCalendarAlt /> Review Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
                  value={customData.createdAt}
                  onChange={(e) =>
                    setCustomData({ ...customData, createdAt: e.target.value })
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty to use today's date.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={32}
                      className={`cursor-pointer transition ${
                        star <= customData.rating
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-700"
                      }`}
                      onClick={() =>
                        setCustomData({ ...customData, rating: star })
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows="3"
                  placeholder="What did the buyer say?"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
                  value={customData.comment}
                  onChange={(e) =>
                    setCustomData({ ...customData, comment: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className=" text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaImage /> Add Chat Screenshots (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setCustomImages(e.target.files)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 dark:file:bg-yellow-900/20 dark:file:text-yellow-500 cursor-pointer transition"
                />
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  Max 2 images are recommended for best layout.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-snap-yellow hover:bg-yellow-500 font-black py-3.5 rounded-xl text-black transition flex justify-center items-center gap-2 mt-4 shadow-md"
              >
                Publish to Store
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviewsPage;
