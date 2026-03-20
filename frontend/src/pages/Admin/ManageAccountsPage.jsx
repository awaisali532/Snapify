import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

// NAYA JADOO: Loader import kiya
import { LoaderContext } from "../../context/LoaderContext";

const ManageAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // NAYA JADOO: Context se show aur hide functions nikal liye
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // ==========================================
  // 1. Data Mangwana (Fetch Accounts)
  // ==========================================
  const fetchAccounts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/api/accounts`);
      setAccounts(response.data.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      Swal.fire("Error", "Could not fetch accounts from database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ==========================================
  // 2. Delete Logic (With VIP Loader & Rollback)
  // ==========================================
  const handleDelete = async (id) => {
    // Pehle Admin se confirm karo
    const result = await Swal.fire({
      title: "Are you sure? 🚨",
      text: "This will permanently delete the account AND its images from Cloudinary!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // LOADER ON KAREIN (Sath custom text bhejein)
      showLoader("Deleting Account... 🗑️");

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token"); // Admin pass

        // Backend ki API ko Hit kiya
        await axios.delete(`${API_URL}/api/accounts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Page refresh kiye bina table se wo account nikal do
        setAccounts(accounts.filter((acc) => acc._id !== id));

        Swal.fire(
          "Deleted! 🗑️",
          "Account has been permanently removed.",
          "success",
        );
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Failed to delete account.",
          "error",
        );
      } finally {
        // LOADER OFF KAREIN (Chahay pass ho ya fail, loader band hona chahiye)
        hideLoader();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Manage Accounts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            View, edit, or delete listed Snapchat accounts.
          </p>
        </div>
        <Link
          to="/admin/add-account"
          className="bg-snap-yellow text-black font-bold px-6 py-2.5 rounded-lg hover:shadow-lg transition text-center"
        >
          + Add New Account
        </Link>
      </div>

      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              No accounts found. Start by adding one!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <th className="p-4">Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {accounts.map((account) => (
                  <tr
                    key={account._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {account.images && account.images.length > 0 ? (
                          <img
                            src={account.images[0]}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Img
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {account.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {account.gender} Setup
                      </p>
                    </td>
                    <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                      {account.score}
                    </td>
                    <td className="p-4 font-black text-snap-dark dark:text-snap-yellow">
                      Rs {account.price}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {/* View Button */}
                        <Link
                          to={`/account/${account._id}`}
                          target="_blank"
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="View Public Page"
                        >
                          <FaEye size={18} />
                        </Link>
                        {/* Edit Button */}
                        <Link
                          to={`/admin/edit-account/${account._id}`}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                          title="Edit Account"
                        >
                          <FaEdit size={18} />
                        </Link>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(account._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete Account"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAccountsPage;
