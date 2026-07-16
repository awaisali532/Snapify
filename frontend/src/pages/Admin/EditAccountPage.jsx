import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import { LoaderContext } from "../../context/LoaderContext";

const EditAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // ==========================================
  // 1. Data Mangwana
  // ==========================================
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/accounts/admin/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = response.data.data;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          score: data.score || "",
          followers: data.followers || "",
          gender: data.gender || "Any",
          features: data.features ? data.features.join(", ") : "",
          snapchatUsername: data.snapchatUsername || "",
          snapchatPassword: data.snapchatPassword || "",
          recoveryEmail: data.recoveryEmail || "",
          emailPassword: data.emailPassword || "",
        });

        if (data.images) {
          setExistingImages(data.images);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
        Swal.fire("Error", "Could not fetch account details.", "error").then(
          () => {
            navigate("/admin/manage-accounts");
          },
        );
      } finally {
        setFetching(false);
      }
    };

    fetchAccountDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // Image Selection
  // ==========================================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + newImages.length + files.length > 5) {
      Swal.fire(
        "Limit Reached",
        "You can only keep a maximum of 5 images total.",
        "warning",
      );
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // ==========================================
  // SUBMIT UPDATE LOGIC
  // ==========================================
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

    if (existingImages.length + newImages.length === 0) {
      return Swal.fire("Error", "Please keep at least 1 image.", "warning");
    }

    setLoading(true);
    showLoader("Updating Account... 🚀");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      let uploadedImageUrls = [];

      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((image) => {
          console.log(image.name, image.size / 1024 / 1024, "MB");

          imageFormData.append("images", image);
        });

        // ==========================================
        // 🔥 JADOO: YAHAN /multiple LAGA DIYA HAI
        // ==========================================
        const uploadRes = await axios.post(
          `${API_URL}/api/upload/multiple`,
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        uploadedImageUrls = uploadRes.data.urls;
      }

      const finalImagesArray = [...existingImages, ...uploadedImageUrls];

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
        images: finalImagesArray,
      };

      await axios.put(`${API_URL}/api/accounts/${id}`, finalAccountData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Updated! 🎉",
        text: "Account has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#facc15",
      }).then(() => {
        navigate("/admin/manage-accounts");
      });
    } catch (error) {
      const exactErrorMsg =
        error.response?.data?.message || "Unknown Server Error";
      Swal.fire("Database Error!", exactErrorMsg, "error");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Edit Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Update the details of your listed Snapchat account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 space-y-8"
      >
        {/* SECTION 1: Public Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            Public Information
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
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Snap Score *
              </label>
              <input
                type="text"
                name="score"
                required
                value={formData.score}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Followers Count
              </label>
              <input
                type="number"
                name="followers"
                min="0"
                value={formData.followers}
                onChange={handleChange}
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
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-snap-yellow outline-none transition"
              />
            </div>

            {/* ==========================================
                VIP IMAGE PREVIEW 
                ========================================== */}
            <div className="md:col-span-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Manage Images (Max 5 Total)
                </label>
                <span className="text-xs font-bold bg-snap-yellow text-black px-2 py-1 rounded-full">
                  {existingImages.length + newImages.length} / 5
                </span>
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={existingImages.length + newImages.length >= 5}
                className="w-full mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-snap-yellow file:text-black hover:file:bg-yellow-400 cursor-pointer text-gray-600 dark:text-gray-400 disabled:opacity-50"
              />

              {(existingImages.length > 0 || newImages.length > 0) && (
                <div className="flex flex-wrap gap-4 mt-4 p-4 bg-white dark:bg-snap-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                  {existingImages.map((url, index) => (
                    <div
                      key={`old-${index}`}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-green-400 dark:border-green-600 shadow-sm group"
                    >
                      <div className="absolute top-0 left-0 w-full bg-green-500/80 text-white text-[10px] text-center font-bold z-10 py-0.5">
                        Existing
                      </div>
                      <img
                        src={url}
                        alt={`Old ${index}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-4 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md z-20"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}

                  {newImages.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-snap-yellow shadow-sm group"
                    >
                      <div className="absolute top-0 left-0 w-full bg-snap-yellow/90 text-black text-[10px] text-center font-bold z-10 py-0.5">
                        New
                      </div>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-4 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md z-20"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Private Details */}
        <div>
          <h3 className="text-lg font-bold text-red-500 dark:text-red-400 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            Secret Credentials
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
            {loading ? "Updating Account..." : "Update Account 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccountPage;
