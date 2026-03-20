import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaKey,
  FaTrashAlt,
  FaFire,
  FaPlayCircle, // NAYA JADOO: Processing start karne ka icon
} from "react-icons/fa";
import { LoaderContext } from "../../context/LoaderContext";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const fetchOrders = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire("Error", "Could not load orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewScreenshot = (url) => {
    Swal.fire({
      title: "Payment Receipt",
      imageUrl: url,
      imageAlt: "Payment Screenshot",
      imageWidth: 400,
      confirmButtonColor: "#facc15",
      confirmButtonText: "Close",
    });
  };

  const viewCredentials = (order) => {
    let htmlContent = "";

    if (order.orderType === "Boosting") {
      htmlContent = `
        <div class="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-2 text-gray-900 dark:text-white">
          <p class="mb-3"><span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">🚀 Boosting Order</span></p>
          <p><b>Target Username:</b> ${order.snapchatUsername}</p>
          <p><b>Password Given:</b> ${order.snapchatPassword}</p>
        </div>
      `;
    } else {
      if (!order.account)
        return Swal.fire("Error", "Account details not found.", "error");
      htmlContent = `
        <div class="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-2 text-gray-900 dark:text-white">
          <p class="mb-3"><span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">📦 Account Buy</span></p>
          <p><b>Username:</b> ${order.account.snapchatUsername}</p>
          <p><b>Password:</b> ${order.account.snapchatPassword}</p>
          ${order.account.recoveryEmail ? `<p><b>Email:</b> ${order.account.recoveryEmail}</p>` : ""}
          ${order.account.emailPassword ? `<p><b>Email Pass:</b> ${order.account.emailPassword}</p>` : ""}
        </div>
      `;
    }

    Swal.fire({
      title: "Secret Credentials 🤫",
      html: htmlContent,
      icon: "info",
      confirmButtonColor: "#facc15",
    });
  };

  // NAYA JADOO: Smart Update Status function (Order ki type ke hisab se text badlega)
  const updateStatus = async (order, newStatus) => {
    const isBoosting = order.orderType === "Boosting";
    let alertText = "";

    if (newStatus === "Rejected") {
      alertText = isBoosting
        ? "This will reject the boosting order!"
        : "This will put the account back on sale!";
    } else if (newStatus === "In Progress") {
      alertText = "Payment verified? Start the boosting process now?";
    } else if (newStatus === "Verified") {
      alertText = isBoosting
        ? "Is the score boosting fully completed?"
        : "Are you sure you have received the payment?";
    }

    const isConfirm = await Swal.fire({
      title: `Mark as ${newStatus === "Verified" && isBoosting ? "Completed" : newStatus}?`,
      text: alertText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor:
        newStatus === "Verified"
          ? "#22c55e"
          : newStatus === "In Progress"
            ? "#3b82f6"
            : "#ef4444",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, do it!`,
    });

    if (!isConfirm.isConfirmed) return;

    showLoader(`Updating status...`);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/orders/${order._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire("Success!", `Order status updated.`, "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Failed to update order status.", "error");
    } finally {
      hideLoader();
    }
  };

  const deleteOrder = async (orderId) => {
    // Delete logic remains same...
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this order and its receipt from Cloudinary. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!isConfirm.isConfirmed) return;
    showLoader("Deleting order...");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "Order has been removed.", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Failed to delete order.", "error");
    } finally {
      hideLoader();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Manage Orders 📦
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Verify payments and deliver accounts to your buyers.
        </p>
      </div>

      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-sm">
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Buyer Info
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Item Details
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Payment
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition"
                  >
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {order.buyerName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.buyerPhone}
                      </p>
                      {order.buyerEmail && (
                        <p className="text-xs text-gray-400">
                          {order.buyerEmail}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      {order.orderType === "Boosting" ? (
                        <>
                          <div className="font-bold text-gray-900 dark:text-white line-clamp-1 flex flex-wrap items-center gap-1.5 mb-1">
                            <span>
                              {order.scorePackage
                                ? order.scorePackage.title
                                : "Boosting Package"}
                            </span>
                            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-[10px] px-2 py-0.5 rounded-full uppercase">
                              Boost
                            </span>
                            {order.scorePackage?.isOffer && (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                <FaFire /> Offer
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Price: Rs {order.priceAtPurchase}
                          </p>
                        </>
                      ) : order.account ? (
                        <>
                          <div className="font-bold text-gray-900 dark:text-white line-clamp-1 flex flex-wrap items-center gap-1.5 mb-1">
                            <span>{order.account.title}</span>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full uppercase">
                              Account
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Price: Rs {order.priceAtPurchase}
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500 text-sm">Account Deleted</p>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold rounded">
                        {order.paymentMethod}
                      </span>
                      <button
                        onClick={() => viewScreenshot(order.paymentScreenshot)}
                        className="mt-2 flex items-center gap-1 text-sm text-yellow-500 dark:text-snap-yellow hover:underline font-bold transition-colors"
                      >
                        <FaImage /> View Receipt
                      </button>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === "Verified"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : order.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : order.status === "In Progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {/* NAYA JADOO: Agar boosting order Verified hai toh 'Completed' dikhao */}
                        {order.status === "Verified" &&
                        order.orderType === "Boosting"
                          ? "Completed"
                          : order.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => viewCredentials(order)}
                          className="text-gray-500 hover:text-yellow-500 dark:hover:text-snap-yellow transition"
                          title="View Credentials"
                        >
                          <FaKey size={18} />
                        </button>

                        {/* NAYA JADOO: ACTION BUTTONS LOGIC */}

                        {/* 1. Account Order Actions */}
                        {order.orderType === "Account" &&
                          order.status === "Pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(order, "Verified")}
                                className="text-green-500 hover:text-green-600 transition"
                                title="Verify Payment"
                              >
                                <FaCheckCircle size={20} />
                              </button>
                              <button
                                onClick={() => updateStatus(order, "Rejected")}
                                className="text-red-500 hover:text-red-600 transition"
                                title="Reject Receipt"
                              >
                                <FaTimesCircle size={20} />
                              </button>
                            </>
                          )}

                        {/* 2. Boosting Order Actions */}
                        {order.orderType === "Boosting" &&
                          order.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(order, "In Progress")
                                }
                                className="text-blue-500 hover:text-blue-600 transition"
                                title="Payment Received - Start Boosting"
                              >
                                <FaPlayCircle size={20} />
                              </button>
                              <button
                                onClick={() => updateStatus(order, "Rejected")}
                                className="text-red-500 hover:text-red-600 transition"
                                title="Reject Receipt"
                              >
                                <FaTimesCircle size={20} />
                              </button>
                            </>
                          )}

                        {/* Boosting In-Progress to Completed */}
                        {order.orderType === "Boosting" &&
                          order.status === "In Progress" && (
                            <button
                              onClick={() => updateStatus(order, "Verified")}
                              className="text-green-500 hover:text-green-600 transition"
                              title="Mark Boosting Completed"
                            >
                              <FaCheckCircle size={20} />
                            </button>
                          )}

                        {/* Delete Button (Order pending ya in progress na ho) */}
                        {order.status !== "Pending" &&
                          order.status !== "In Progress" && (
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="text-gray-400 hover:text-red-600 transition ml-2"
                              title="Delete Order & Receipt"
                            >
                              <FaTrashAlt size={18} />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersPage;
