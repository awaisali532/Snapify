import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaTrashAlt,
  FaPlusCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaMoneyCheckAlt,
  FaEdit,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { LoaderContext } from "../../context/LoaderContext";

const ManagePaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    _id: null,
    methodName: "",
    title: "",
    details: "",
    isActive: true,
  });

  const fetchMethods = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      // Admin API taake hidden methods bhi aayein
      const response = await axios.get(`${API_URL}/api/payment-methods/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMethods(response.data.data);
    } catch (error) {
      console.error("Error fetching methods:", error);
      Swal.fire("Error", "Could not load payment methods.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      _id: null,
      methodName: "",
      title: "",
      details: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (method) => {
    setEditMode(true);
    setFormData({
      _id: method._id,
      methodName: method.methodName,
      title: method.title,
      details: method.details,
      isActive: method.isActive,
    });
    setShowModal(true);
  };

  // TOGGLE ACTIVE STATUS
  const toggleActiveStatus = async (id, currentStatus) => {
    showLoader("Updating status...");
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/payment-methods/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchMethods();
    } catch (error) {
      Swal.fire("Error", "Could not update status", "error");
    } finally {
      hideLoader();
    }
  };

  // DELETE METHOD
  const handleDelete = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Delete Method?",
      text: "Are you sure you want to remove this payment option?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (!isConfirm.isConfirmed) return;

    showLoader("Deleting...");
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/payment-methods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Deleted!", "Payment method has been removed.", "success");
      fetchMethods();
    } catch (error) {
      Swal.fire("Error", "Failed to delete payment method", "error");
    } finally {
      hideLoader();
    }
  };

  // ADD OR UPDATE METHOD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showLoader(editMode ? "Updating Method..." : "Saving Method...");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const payload = {
        methodName: formData.methodName,
        title: formData.title,
        details: formData.details,
        isActive: formData.isActive,
      };

      if (editMode) {
        await axios.put(
          `${API_URL}/api/payment-methods/${formData._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire("Updated!", "Payment method updated.", "success");
      } else {
        await axios.post(`${API_URL}/api/payment-methods`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Added!", "New payment method is live.", "success");
      }

      setShowModal(false);
      fetchMethods();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to save method",
        "error",
      );
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-snap-yellow"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Payment Methods{" "}
            <FaMoneyCheckAlt className="text-yellow-500 dark:text-snap-yellow" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Manage bank accounts, crypto wallets, and mobile wallets.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-yellow-500 dark:bg-snap-yellow text-black font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-sm hover:cursor-pointer"
        >
          <FaPlusCircle /> Add New Method
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Method Name
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Display Title
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Account Details
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                  Visibility
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {methods.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No payment methods found. Add one to allow users to
                    checkout!
                  </td>
                </tr>
              ) : (
                methods.map((method) => (
                  <tr
                    key={method._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition"
                  >
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      {method.methodName}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {method.title}
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed max-w-xs truncate">
                        {method.details}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          toggleActiveStatus(method._id, method.isActive)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-full flex items-center justify-center gap-1 mx-auto transition-colors ${
                          method.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {method.isActive ? (
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
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(method)}
                          className="text-gray-400 hover:text-yellow-500 dark:hover:text-snap-yellow transition"
                          title="Edit Details"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(method._id)}
                          className="text-gray-400 hover:text-red-600 transition"
                          title="Delete Method"
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

      {/* ADD/EDIT MODAL */}
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
              {editMode ? "Edit Payment Method" : "Add Payment Method"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Provide the exact details buyers need to send money.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Method Name (Short) *
                </label>
                <input
                  type="text"
                  placeholder="e.g., SadaPay"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
                  value={formData.methodName}
                  onChange={(e) =>
                    setFormData({ ...formData, methodName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Display Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., SadaPay Transfer"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Account Details (What buyer sees) *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Account No: 03XXXXXXXXX&#10;Account Title: Awais Ali"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Use "Enter" for new lines (Line breaks are supported).
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 dark:bg-snap-yellow hover:bg-yellow-600 dark:hover:bg-yellow-500 font-black py-3.5 rounded-xl text-black transition flex justify-center items-center shadow-md"
              >
                {editMode ? "Update Method" : "Add Method"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePaymentMethods;
