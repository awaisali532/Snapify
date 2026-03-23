import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import { LoaderContext } from "../../context/LoaderContext";
import { CurrencyContext } from "../../context/CurrencyContext";
import { AuthContext } from "../../context/AuthContext";

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const { currency, symbols, calculatePrice } = useContext(CurrencyContext);
  const { user } = useContext(AuthContext);

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // NAYA JADOO: Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [formData, setFormData] = useState({
    buyerName: user?.name || "",
    buyerPhone: "",
    buyerEmail: user?.email || "",
    paymentMethod: "",
  });

  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // 1. Login Check
    if (!user) {
      Swal.fire("Access Denied", "Please login to checkout.", "warning").then(
        () => navigate("/login"),
      );
      return;
    }

    // NAYA JADOO: Admin Block Logic
    if (user.role === "admin") {
      Swal.fire("Admin Restricted", "Admins cannot place orders.", "info").then(
        () => navigate("/"),
      );
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        // 1. Fetch Account Details
        const response = await axios.get(`${API_URL}/api/accounts/${id}`);
        if (response.data.data.isSold) {
          Swal.fire(
            "Oops!",
            "This account is already sold out.",
            "warning",
          ).then(() => navigate("/"));
          return;
        }
        setAccount(response.data.data);

        // 2. Fetch Dynamic Payment Methods
        const paymentsResponse = await axios.get(
          `${API_URL}/api/payment-methods`,
        );
        if (paymentsResponse.data.success) {
          setPaymentMethods(paymentsResponse.data.data);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Required data not found or available.",
          "error",
        ).then(() => navigate("/"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    if (e.target.files[0]) setScreenshot(e.target.files[0]);
  };
  const removeScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // 1. PEHLE FORM KI VALIDATION CHECK KAREIN
    // ==========================================
    if (!formData.paymentMethod) {
      return Swal.fire(
        "Required",
        "Please select a payment method.",
        "warning",
      );
    }

    if (!screenshot) {
      return Swal.fire(
        "Required",
        "Please upload the payment screenshot.",
        "warning",
      );
    }

    // ==========================================
    // 2. AGAR FORM THEEK HAI, TOH SAFETY POPUP DIKHAYEIN
    // ==========================================
    const result = await Swal.fire({
      title: "🛡️ Anti-Ban Safety Rules",
      html: `
      <div style="text-align: left; font-size: 15px; color: #4b5563;">
        <p style="color: #ef4444; font-weight: bold; margin-bottom: 10px;">
          ⚠️ Follow these rules for our 100% Guarantee:
        </p>
        <ul style="padding-left: 20px; line-height: 1.8; list-style-type: disc;">
          <li><b>Do NOT</b> change Username, Email, or Password for the first <b>24 Hours</b>.</li>
          <li><b>Do NOT</b> add or remove too many friends for <b>7 Days</b>.</li>
          <li>Just send normal streaks and use the account naturally.</li>
        </ul>
        <p style="margin-top: 15px; font-size: 13px; color: #6b7280;">
          <i>*Snapchat locks accounts if details are changed immediately on a new device due to IP Change. Snapchat needs at least 24 Hours to build trust on your IP.</i>
        </p>
      </div>
    `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#d33",
      confirmButtonText: '<b style="color: black;">I Agree, Place Order 🚀</b>',
      cancelButtonText: "Cancel",
      background: "#ffffff",
    });

    // Agar user ne Cancel kar diya, toh yahin ruk jao
    if (!result.isConfirmed) return;

    // ==========================================
    // 3. AGAR AGREE KAR LIYA, TOH ORDER PLACE KAREIN
    // ==========================================
    showLoader("Placing Order... 🚀");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const imageFormData = new FormData();
      imageFormData.append("image", screenshot);

      const uploadRes = await axios.post(
        `${API_URL}/api/upload?folder=receipts`,
        imageFormData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const uploadedScreenshotUrl = uploadRes.data.imageUrl;

      const finalOrderData = {
        ...formData,
        orderType: "Account",
        accountId: id,
        paymentScreenshot: uploadedScreenshotUrl,
      };

      await axios.post(`${API_URL}/api/orders`, finalOrderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Order Placed! 🎉",
        text: "Your order is pending verification. You can check the status in your 'My Orders' dashboard.",
        icon: "success",
        confirmButtonColor: "#facc15",
        confirmButtonText: "View My Orders",
      }).then(() => {
        navigate("/my-orders", { replace: true });
      });
    } catch (error) {
      console.error("Checkout Error:", error);
      Swal.fire(
        "Checkout Failed!",
        error.response?.data?.message || "Failed to place order.",
        "error",
      );
    } finally {
      hideLoader();
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-snap-yellow"></div>
      </div>
    );
  }

  const displaySymbol = symbols[currency] || "Rs";
  const displayPrice = account ? calculatePrice(account.price) : "0";

  // NAYA JADOO: Get Selected Payment Details
  const selectedPaymentMethodDetails = paymentMethods.find(
    (m) => m.methodName === formData.paymentMethod,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
          Secure Checkout 🔒
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Complete your payment to get instant access to your new Snapchat
          account.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT SIDE: PAYMENT FORM */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
            Billing & Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="buyerName"
                  required
                  value={formData.buyerName}
                  onChange={handleChange}
                  placeholder="Awais Ali"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  name="buyerPhone"
                  required
                  value={formData.buyerPhone}
                  onChange={handleChange}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleChange}
                placeholder="awais@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
              />
            </div>

            {/* DYNAMIC Payment Method Dropdown */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Select Payment Method *
              </label>
              <select
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none transition"
              >
                <option value="" disabled>
                  -- Choose a method --
                </option>
                {paymentMethods.map((method) => (
                  <option key={method._id} value={method.methodName}>
                    {method.methodName}
                  </option>
                ))}
              </select>
            </div>

            {/* DYNAMIC Payment Details Alert */}
            {selectedPaymentMethodDetails && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-snap-yellow p-4 rounded-r-lg">
                <h4 className="font-bold text-gray-900 dark:text-yellow-400 mb-2">
                  {selectedPaymentMethodDetails.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                  {selectedPaymentMethodDetails.details}
                </p>
                <p className="text-xs font-bold text-red-500 mt-3">
                  * Please send exactly{" "}
                  <b>
                    {displaySymbol} {displayPrice}
                  </b>{" "}
                  to the above account and upload the screenshot below.
                </p>
              </div>
            )}

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Upload Payment Screenshot *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 text-center">
                {!screenshot && (
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-500 dark:file:bg-snap-yellow file:text-black hover:file:bg-yellow-600 cursor-pointer text-gray-600 dark:text-gray-400"
                  />
                )}

                {screenshot && (
                  <div className="mt-2 flex flex-col items-center">
                    <p className="text-sm text-green-600 dark:text-green-400 font-bold mb-3">
                      Selected File: {screenshot.name}
                    </p>
                    <div className="relative inline-block group">
                      <img
                        src={URL.createObjectURL(screenshot)}
                        alt="Preview"
                        className="h-32 object-contain rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110 z-10"
                        title="Remove image"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 dark:bg-snap-yellow text-black font-black text-lg py-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Submit Order & Verify 🚀
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
            Order Summary
          </h2>

          {account && (
            <div>
              {account.images && account.images.length > 0 && (
                <img
                  src={account.images[0]}
                  alt="Account Thumbnail"
                  className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
                />
              )}
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 leading-tight">
                {account.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {account.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Snap Score
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {account.score}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Niche
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {account.gender}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-end">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Total Price
                </span>
                <span className="text-3xl font-black text-yellow-500 dark:text-snap-yellow">
                  {displaySymbol} {displayPrice}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
