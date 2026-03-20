import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaTrashAlt,
  FaPlusCircle,
  FaTimesCircle,
  FaCheckCircle,
  FaFire,
  FaEye,
  FaEyeSlash,
  FaBolt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { LoaderContext } from "../../context/LoaderContext";

const ManageScorePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    scoreAmount: "",
    price: "",
    deliveryTime: "1-2 Days",
    isOffer: false,
    offerPrice: "",
    features: "", // Line by line features
    isActive: true,
  });

  const fetchPackages = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      // Admin route se mangwayenge taake hidden wale bhi nazar aayein
      const response = await axios.get(`${API_URL}/api/score-packages/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // TOGGLE ACTIVE STATUS (Hide/Show on Website)
  const toggleActiveStatus = async (id, currentStatus) => {
    showLoader("Updating status...");
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/score-packages/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchPackages();
    } catch (error) {
      Swal.fire("Error", "Could not update status", "error");
    } finally {
      hideLoader();
    }
  };

  // DELETE PACKAGE
  const handleDelete = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Delete Package?",
      text: "Are you sure you want to remove this package permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (!isConfirm.isConfirmed) return;

    showLoader("Deleting Package...");
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/score-packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Deleted!", "Package has been removed.", "success");
      fetchPackages();
    } catch (error) {
      Swal.fire("Error", "Failed to delete package", "error");
    } finally {
      hideLoader();
    }
  };

  // ADD NEW PACKAGE
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Features ko line by line array me convert karna
    const featuresArray = formData.features
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    if (featuresArray.length === 0) {
      return Swal.fire("Oops", "Please add at least one feature!", "warning");
    }

    if (
      formData.isOffer &&
      (!formData.offerPrice || formData.offerPrice >= formData.price)
    ) {
      return Swal.fire(
        "Invalid Offer",
        "Offer price must be less than the regular price.",
        "warning",
      );
    }

    setIsSubmitting(true);
    showLoader("Publishing Package...");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const packageData = {
        ...formData,
        features: featuresArray,
        scoreAmount: Number(formData.scoreAmount),
        price: Number(formData.price),
        offerPrice: formData.isOffer ? Number(formData.offerPrice) : 0,
      };

      await axios.post(`${API_URL}/api/score-packages`, packageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Added!", "New Score Package is live.", "success");
      setShowModal(false);
      setFormData({
        title: "",
        scoreAmount: "",
        price: "",
        deliveryTime: "1-2 Days",
        isOffer: false,
        offerPrice: "",
        features: "",
        isActive: true,
      });
      fetchPackages();
    } catch (error) {
      Swal.fire("Error", "Failed to add package", "error");
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
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
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Score Packages{" "}
            <FaBolt className="text-yellow-500 dark:text-snap-yellow" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Create and manage Snap Score boosting packages.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-snap-dark dark:bg-snap-yellow text-white dark:text-black font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-sm hover:cursor-pointer"
        >
          <FaPlusCircle /> Create Package
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Package Details
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Pricing
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                  Visibility
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {packages.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No packages found. Create one to get started!
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr
                    key={pkg._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition"
                  >
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {pkg.title}
                        {pkg.isOffer && (
                          <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                            <FaFire /> OFFER
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Target: {pkg.scoreAmount.toLocaleString()} Score |
                        Delivery: {pkg.deliveryTime}
                      </p>
                    </td>
                    <td className="p-4">
                      {pkg.isOffer ? (
                        <div>
                          <p className="text-xs text-gray-400 line-through">
                            Rs. {pkg.price}
                          </p>
                          <p className="text-sm font-black text-yellow-500 dark:text-snap-yellow">
                            Rs. {pkg.offerPrice}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          Rs. {pkg.price}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          toggleActiveStatus(pkg._id, pkg.isActive)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-full flex items-center justify-center gap-1 mx-auto transition-colors ${
                          pkg.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {pkg.isActive ? (
                          <>
                            <FaEye /> Active
                          </>
                        ) : (
                          <>
                            <FaEyeSlash /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(pkg._id)}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Delete Package"
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

      {/* CREATE PACKAGE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-10">
          <div className="bg-white dark:bg-snap-card rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimesCircle size={24} />
            </button>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Create Score Package
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Design a new boosting package for your storefront.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ROW 1: Title & Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Diamond Boost"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Target Score *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 100000"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                    value={formData.scoreAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, scoreAmount: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* ROW 2: Price & Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Regular Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1500"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Time *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1-2 Days"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                    value={formData.deliveryTime}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryTime: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* OFFER TOGGLE SECTION */}
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="isOffer"
                    className="w-5 h-5 accent-yellow-500 dark:accent-snap-yellow cursor-pointer"
                    checked={formData.isOffer}
                    onChange={(e) =>
                      setFormData({ ...formData, isOffer: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="isOffer"
                    className="font-bold text-gray-900 dark:text-white cursor-pointer flex items-center gap-1"
                  >
                    <FaFire className="text-red-500" /> Make this a VIP Offer?
                  </label>
                </div>

                {formData.isOffer && (
                  <div className="mt-3 animate-fade-in-up">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Discounted Offer Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 999"
                      required={formData.isOffer}
                      className="w-full bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                      value={formData.offerPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, offerPrice: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              {/* FEATURES (TEXTAREA) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Package Features (One per line) *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="100% Safe & Ban-Free&#10;No Password Required&#10;Fast Delivery"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Press "Enter" to add a new bullet point.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 dark:bg-snap-yellow hover:bg-yellow-600 dark:hover:bg-yellow-500 font-black py-3.5 rounded-xl text-black transition flex justify-center items-center gap-2 mt-4 shadow-md"
              >
                Publish Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScorePackages;
