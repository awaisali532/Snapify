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
  FaLink,
  FaTimes,
  FaEdit, // 🟡 NAYA JADOO: Edit icon
} from "react-icons/fa";
import Swal from "sweetalert2";
import { LoaderContext } from "../../context/LoaderContext";

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🟡 NAYA JADOO: Edit Mode Tracking
  const [editingId, setEditingId] = useState(null);

  const [customData, setCustomData] = useState({
    name: "",
    rating: 5,
    comment: "",
    createdAt: "",
    socialLink: "",
  });

  // 🟡 NAYA JADOO: Images States (Purani aur Nayi dono ke liye)
  const [existingImages, setExistingImages] = useState([]); // Jo database se aayin
  const [customImages, setCustomImages] = useState([]); // Jo nayi select ki hain

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

  // ==========================================
  // 🟡 NAYA JADOO: Modal Open (For Create)
  // ==========================================
  const openCreateModal = () => {
    setEditingId(null);
    setCustomData({
      name: "",
      rating: 5,
      comment: "",
      createdAt: "",
      socialLink: "",
    });
    setExistingImages([]);
    setCustomImages([]);
    setShowModal(true);
  };

  // ==========================================
  // 🟡 NAYA JADOO: Modal Open (For Edit)
  // ==========================================
  const handleEditClick = (review) => {
    setEditingId(review._id);

    // Date ko input form ke hisab se format karna
    const formattedDate = review.createdAt
      ? new Date(review.createdAt).toISOString().split("T")[0]
      : "";

    setCustomData({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: formattedDate,
      socialLink: review.socialLink || "",
    });

    setExistingImages(review.images || []);
    setCustomImages([]); // Nayi tasweerein filhal khali
    setShowModal(true);
  };

  // ==========================================
  // 🟡 NAYA JADOO: Smart Image Selection
  // ==========================================
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const totalImages =
      existingImages.length + customImages.length + newFiles.length;

    if (totalImages > 2) {
      Swal.fire(
        "Limit Reached",
        "You can only have a maximum of 2 images total.",
        "warning",
      );
      return;
    }

    setCustomImages((prev) => [...prev, ...newFiles]);
    e.target.value = null;
  };

  // Nayi upload hone wali tasweer remove karna
  const removeCustomImage = (indexToRemove) => {
    setCustomImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // Purani (Database wali) tasweer remove karna
  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

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
      hideLoader();
    }
  };

  const submitCustomReview = async (e) => {
    e.preventDefault();
    if (!customData.name || !customData.comment)
      return Swal.fire("Oops", "Name and comment required!", "warning");

    setIsSubmitting(true);
    showLoader(editingId ? "Updating Review..." : "Publishing Review...");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      let uploadedImageUrls = [];

      // Agar koi NAYI tasweer select ki hai, toh pehle usay Cloudinary par bhejo
      if (customImages.length > 0) {
        const formData = new FormData();
        customImages.forEach((file) => formData.append("images", file));

        const uploadRes = await axios.post(
          `${API_URL}/api/upload/multiple?folder=reviews`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        uploadedImageUrls = uploadRes.data.urls;
      }

      // Purani bachi hui tasweerein aur nayi tasweeron ko mila do
      const finalImages = [...existingImages, ...uploadedImageUrls];
      const payload = { ...customData, images: finalImages };

      // 🟡 JADOO: Edit vs Create Logic
      if (editingId) {
        await axios.put(`${API_URL}/api/reviews/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Updated!", "Review updated successfully.", "success");
      } else {
        await axios.post(`${API_URL}/api/reviews/admin`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Added!", "Custom review is live.", "success");
      }

      setShowModal(false);
      fetchReviews();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        editingId ? "Failed to update review" : "Failed to add review",
        "error",
      );
    } finally {
      setIsSubmitting(false);
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
          onClick={openCreateModal}
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
                      {r.socialLink && (
                        <a
                          href={r.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500 hover:text-blue-600"
                          title="View Profile"
                        >
                          <FaLink className="inline" size={12} />
                        </a>
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
                    {/* 🟡 NAYA JADOO: Edit & Delete Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEditClick(r)}
                          className="text-blue-400 hover:text-blue-600 transition"
                          title="Edit Review"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-red-400 hover:text-red-600 transition"
                          title="Delete Review"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
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
              {editingId ? "Edit Review" : "Add Local Deal Review"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {editingId
                ? "Update the details of this review."
                : "Manually add reviews for customers who bought from you."}
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
                  <FaLink className="text-gray-400" /> Buyer Profile Link
                  (Optional)
                </label>
                <input
                  type="url"
                  placeholder="e.g., https://snapchat.com/add/username"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
                  value={customData.socialLink}
                  onChange={(e) =>
                    setCustomData({ ...customData, socialLink: e.target.value })
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
                      className={`cursor-pointer transition ${star <= customData.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"}`}
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

              {/* 🟡 VIP IMAGE UPLOAD & PREVIEW SECTION */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaImage /> Add Chat Screenshots (Optional, Max 2)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 dark:file:bg-yellow-900/30 dark:file:text-snap-yellow cursor-pointer transition mb-2"
                />

                <div className="flex flex-wrap gap-3 mt-3">
                  {/* Purani (Existing) Images Dikhana */}
                  {existingImages.map((imgUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm group"
                    >
                      <img
                        src={imgUrl}
                        alt="existing"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors"
                        title="Remove image"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Nayi (Custom) Images Dikhana */}
                  {customImages.map((file, index) => (
                    <div
                      key={`custom-${index}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors"
                        title="Remove image"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Selected: {existingImages.length + customImages.length}/2
                  images
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-snap-yellow hover:bg-yellow-500 font-black py-3.5 rounded-xl text-black transition flex justify-center items-center gap-2 mt-4 shadow-md"
              >
                {editingId ? "Update Review" : "Publish to Store"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviewsPage;
