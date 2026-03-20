import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa"; // NAYA JADOO: Cross Icon import kiya

import { LoaderContext } from "../../context/LoaderContext";

const AddAccountPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    score: "",
    followers: "",
    gender: "Any",
    features: "",
    snapchatUsername: "",
    snapchatPassword: "",
    recoveryEmail: "",
    emailPassword: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // JADOO: Smart Image Selection
  // ==========================================
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Check karein ke limit cross toh nahi ho rahi
    if (images.length + newFiles.length > 5) {
      Swal.fire(
        "Limit Reached",
        "You can only upload a maximum of 5 images.",
        "warning",
      );
      return;
    }

    // Nayi tasweeron ko purani list mein add karein
    setImages((prevImages) => [...prevImages, ...newFiles]);

    // Input ko clear kar dein taake same photo dubara select ki ja sake agar zaroorat ho
    e.target.value = null;
  };

  // ==========================================
  // JADOO: Image Remove Karne ka Logic
  // ==========================================
  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedPrice = Number(formData.price);
    const parsedFollowers = formData.followers ? Number(formData.followers) : 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return Swal.fire(
        "Error",
        "Price must be a valid number greater than 0.",
        "error",
      );
    }

    // HTML required attribute hata diya tha, isliye yahan check lagana zaroori hai
    if (images.length === 0) {
      return Swal.fire("Error", "Please upload at least 1 image.", "warning");
    }

    if (images.length > 5) {
      return Swal.fire(
        "Error",
        "You can only upload a maximum of 5 images.",
        "warning",
      );
    }

    setLoading(true);
    showLoader("Uploading Account... 🚀");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      let uploadedImageUrls = [];

      const imageFormData = new FormData();
      images.forEach((image) => {
        imageFormData.append("images", image);
      });

      const uploadRes = await axios.post(
        `${API_URL}/api/upload/multiple`,
        imageFormData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      uploadedImageUrls = uploadRes.data.urls;

      const featuresArray = formData.features
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);

      const finalAccountData = {
        ...formData,
        price: parsedPrice,
        followers: parsedFollowers,
        score: String(formData.score),
        features: featuresArray,
        images: uploadedImageUrls,
      };

      await axios.post(`${API_URL}/api/accounts`, finalAccountData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Success! 🎉",
        text: "Account has been listed for sale.",
        icon: "success",
        confirmButtonColor: "#facc15",
      }).then(() => {
        navigate("/admin/manage-accounts");
      });
    } catch (error) {
      const exactErrorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Unknown Server Error";

      Swal.fire({
        title: "Database Error!",
        text: `Error details: ${exactErrorMsg}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Add New Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Fill in the details to list a new Snapchat account for sale.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 space-y-8"
      >
        {/* SECTION 1: Public Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            Public Information (Visible to buyers)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Account Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 500k Score Aesthetic Account"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the account..."
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Price (Rs) *{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (No commas, e.g. 5000)
                </span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Snap Score *{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (e.g. 1.2M, 500k)
                </span>
              </label>
              <input
                type="text"
                name="score"
                required
                value={formData.score}
                onChange={handleChange}
                placeholder="e.g. 1.2M"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Followers Count{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (Numbers only)
                </span>
              </label>
              <input
                type="number"
                name="followers"
                min="0"
                value={formData.followers}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Gender Niche
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any / Neutral</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Key Features (Comma Separated)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g. Real Followers, Active Streaks, OG Email"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            {/* ==========================================
                VIP IMAGE PREVIEW & UPLOAD SECTION
                ========================================== */}
            <div className="md:col-span-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                Upload Images (Max 5) *
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                // 'required' hata diya hai kyunke ab hum state se check kar rahe hain, warna error dega
                className="w-full mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-snap-yellow file:text-black hover:file:bg-yellow-400 cursor-pointer text-gray-600 dark:text-gray-400"
              />

              {/* JADOO: Image Preview Grid */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4 p-4 bg-white dark:bg-snap-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm group"
                    >
                      {/* URL.createObjectURL se kacha preview dikhaya */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Cross Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors"
                        title="Remove image"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Private Details (Secret) */}
        <div>
          <h3 className="text-lg font-bold text-red-500 dark:text-red-400 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            Secret Credentials (Never shown to public)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Snapchat Username *
              </label>
              <input
                type="text"
                name="snapchatUsername"
                required
                value={formData.snapchatUsername}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Snapchat Password *
              </label>
              <input
                type="text"
                name="snapchatPassword"
                required
                value={formData.snapchatPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Recovery Email
              </label>
              <input
                type="email"
                name="recoveryEmail"
                value={formData.recoveryEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Email Password
              </label>
              <input
                type="text"
                name="emailPassword"
                value={formData.emailPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-400 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 font-bold rounded-lg shadow-lg transition-all duration-300 ${loading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-snap-yellow text-black hover:shadow-yellow-500/30 hover:-translate-y-1"}`}
          >
            {loading ? "Uploading & Saving..." : "Publish Account 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAccountPage;
