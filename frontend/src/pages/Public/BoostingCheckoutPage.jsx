import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTimes, FaLock } from "react-icons/fa";
import { LoaderContext } from "../../context/LoaderContext";
import { CurrencyContext } from "../../context/CurrencyContext";
import { AuthContext } from "../../context/AuthContext";

const BoostingCheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { currency, symbols, calculatePrice } = useContext(CurrencyContext);
  const { user } = useContext(AuthContext);

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  // NAYA JADOO: Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [formData, setFormData] = useState({
    buyerName: user?.name || "",
    buyerPhone: "",
    buyerEmail: user?.email || "",
    snapchatUsername: "",
    snapchatPassword: "",
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
      Swal.fire(
        "Admin Restricted",
        "Admins cannot place dummy orders.",
        "info",
      ).then(() => navigate("/"));
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        // Fetch Package Details
        const pkgResponse = await axios.get(`${API_URL}/api/score-packages`);
        const foundPkg = pkgResponse.data.data.find((p) => p._id === id);
        if (!foundPkg) throw new Error("Package Not found");
        setPkg(foundPkg);

        // NAYA JADOO: Fetch Dynamic Payment Methods
        const paymentsResponse = await axios.get(
          `${API_URL}/api/payment-methods`,
        );
        if (paymentsResponse.data.success) {
          setPaymentMethods(paymentsResponse.data.data);
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Required data not available.", "error").then(() =>
          navigate("/boosting"),
        );
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
    if (!formData.paymentMethod)
      return Swal.fire("Required", "Select a payment method.", "warning");
    if (!screenshot)
      return Swal.fire("Required", "Upload the payment screenshot.", "warning");

    showLoader("Placing Boost Order... 🚀");

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
        orderType: "Boosting",
        scorePackageId: id,
        paymentScreenshot: uploadedScreenshotUrl,
      };

      await axios.post(`${API_URL}/api/orders`, finalOrderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Order Placed! 🎉",
        text: "We will start boosting your score as soon as payment is verified.",
        icon: "success",
        confirmButtonColor: "#facc15",
      }).then(() => navigate("/my-orders", { replace: true }));
    } catch (error) {
      Swal.fire(
        "Checkout Failed!",
        error.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      hideLoader();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-snap-yellow"></div>
      </div>
    );

  const displaySymbol = symbols[currency] || "Rs";
  const finalPrice = pkg.isOffer ? pkg.offerPrice : pkg.price;
  const displayPrice = calculatePrice(finalPrice);

  // NAYA JADOO: User ne jo method select kiya hai, uski details nikalna
  const selectedPaymentMethodDetails = paymentMethods.find(
    (m) => m.methodName === formData.paymentMethod,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
          Score Boost Checkout 🚀
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Provide your account details securely to start the boost.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* FORM */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-xl border border-yellow-200 dark:border-yellow-800/50 mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaLock className="text-yellow-500 dark:text-snap-yellow" />{" "}
                Snapchat Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="snapchatUsername"
                    required
                    value={formData.snapchatUsername}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                    placeholder="e.g. awais_snap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="snapchatPassword"
                    required
                    value={formData.snapchatPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
                Your credentials are encrypted and automatically deleted after
                the boost is completed.
              </p>
            </div>

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
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  name="buyerPhone"
                  required
                  value={formData.buyerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
                />
              </div>
            </div>

            {/* DYNAMIC PAYMENT METHOD DROPDOWN */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-snap-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow outline-none"
              >
                <option value="" disabled>
                  -- Choose --
                </option>
                {paymentMethods.map((method) => (
                  <option key={method._id} value={method.methodName}>
                    {method.methodName}
                  </option>
                ))}
              </select>
            </div>

            {/* DYNAMIC PAYMENT DETAILS SHOW */}
            {selectedPaymentMethodDetails && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-snap-yellow p-4 rounded-r-lg">
                <h4 className="font-bold text-gray-900 dark:text-yellow-400 mb-2">
                  {selectedPaymentMethodDetails.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                  {selectedPaymentMethodDetails.details}
                </p>
                <p className="text-xs font-bold text-red-500 mt-3">
                  * Send exactly{" "}
                  <b>
                    {displaySymbol} {displayPrice}
                  </b>
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 text-center">
              {!screenshot && (
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer text-gray-600 dark:text-gray-400"
                />
              )}
              {screenshot && (
                <div className="mt-2 flex flex-col items-center">
                  <div className="relative inline-block group">
                    <img
                      src={URL.createObjectURL(screenshot)}
                      alt="Preview"
                      className="h-32 object-contain rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg z-10"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 dark:bg-snap-yellow text-black font-black text-lg py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all"
            >
              Place Boosting Order 🚀
            </button>
          </form>
        </div>

        {/* SUMMARY */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
            Order Summary
          </h2>
          <h3 className="font-black text-2xl text-gray-900 dark:text-white mb-1">
            {pkg.title}
          </h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-bold mb-4">
            +{pkg.scoreAmount.toLocaleString()} Score Boost
          </p>
          <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <li>• Safe Delivery in {pkg.deliveryTime}</li>
            {pkg.features.slice(0, 3).map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-end">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Total Price
            </span>
            <span className="text-3xl font-black text-yellow-500 dark:text-snap-yellow">
              {displaySymbol} {displayPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostingCheckoutPage;
