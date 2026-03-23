import { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaFire,
  FaVenusMars,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";
import { CurrencyContext } from "../../context/CurrencyContext";
import { AuthContext } from "../../context/AuthContext";

const formatToKM = (value) => {
  if (!value) return "0";
  if (
    typeof value === "string" &&
    (value.toLowerCase().includes("k") || value.toLowerCase().includes("m"))
  )
    return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

const AccountDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  const { currency, symbols, calculatePrice } = useContext(CurrencyContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/accounts/${id}`);
        const data = response.data.data;
        setAccount(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Account not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, [id]);

  const handleBuyNow = () => {
    // 1. Admin Alert
    if (user && user.role === "admin") {
      return Swal.fire(
        "Admin Alert! 🛑",
        "Ustad, aap toh khud malik hain! Aapko khareedne ki kya zaroorat hai? 😄",
        "warning",
      );
    }

    // 2. ⏳ RESERVED FOMO POPUP JADOO
    if (account.isReserved) {
      Swal.fire({
        title: "⏳ Account Reserved",
        html: `
          <div style="text-align: left; font-size: 15px; color: #4b5563;">
            <p>This account is currently <b>Pending Payment Verification</b> from another buyer.</p>
            <p style="margin-top: 10px;">If the current buyer fails to pay, it will be available again.</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#facc15",
        cancelButtonColor: "#6b7280",
        confirmButtonText: '<b style="color: black;">Join Waitlist 📩</b>',
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(
            `https://wa.me/923098972484?text=Hi, I want to join the waitlist for the reserved account: ${account.title}`,
            "_blank",
          );
        }
      });
      return;
    }

    // 3. Login Check
    if (!user) {
      return Swal.fire({
        title: "Login Required!",
        text: "Please login or create an account to buy this Snapchat account securely.",
        icon: "info",
        confirmButtonColor: "#facc15",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    }

    // 4. Proceed to Checkout
    navigate(`/checkout/${account._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-snap-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-snap-yellow"></div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-snap-dark text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Account Not Found 😢
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The account you are looking for does not exist, has been sold, or
          there was a network error.
        </p>
        <Link
          to="/accounts"
          className="px-6 py-3 bg-yellow-500 dark:bg-snap-yellow text-black font-bold rounded-lg hover:shadow-lg transition"
        >
          Browse Other Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-snap-dark py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-snap-yellow transition mb-6 font-medium"
        >
          <FaArrowLeft /> Back to Accounts
        </button>

        <div className="bg-white dark:bg-snap-card rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            <div className="relative w-full rounded-2xl shadow-sm mb-4 bg-gray-200 dark:bg-black/50 flex justify-center overflow-hidden">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={account.title}
                  className="w-full h-auto max-h-[70vh] md:max-h-150 object-contain transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-75 flex items-center justify-center text-gray-500 font-bold">
                  No Image Available
                </div>
              )}
            </div>
            {account.images && account.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full justify-center">
                {account.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-yellow-500 dark:border-snap-yellow shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                  <FaFire /> {formatToKM(account.score)} Score
                </span>
                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                  <FaUsers /> {formatToKM(account.followers || 0)} Followers
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1.5 font-bold capitalize">
                  <FaVenusMars /> {account.gender} Setup
                </span>
                {account.isReserved && (
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1.5 font-black animate-pulse shadow-md">
                    <FaClock /> RESERVED
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2">
                {account.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                <FaShieldAlt className="text-green-500" /> 100% Safe & Secure
                Transaction
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                Account Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {account.description ||
                  "No description provided for this account."}
              </p>

              {account.features && account.features.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {account.features.map((feature, idx) => {
                    const isNegative =
                      feature.toLowerCase().includes("not ") ||
                      feature.toLowerCase().startsWith("no ");
                    return (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 font-medium ${isNegative ? "text-gray-500 opacity-80" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        {isNegative ? (
                          <FaTimesCircle className="text-red-500 shrink-0" />
                        ) : (
                          <FaCheckCircle className="text-yellow-500 dark:text-snap-yellow shrink-0" />
                        )}{" "}
                        {feature}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-auto bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">
                Total Price
              </div>
              <div className="text-4xl font-black text-yellow-500 dark:text-snap-yellow mb-6">
                {symbols[currency] || currency} {calculatePrice(account.price)}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  className={`${account.isReserved ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-yellow-500 dark:bg-snap-yellow hover:bg-yellow-600 dark:hover:bg-yellow-400 text-black hover:shadow-lg"} font-black py-4 px-6 rounded-xl transition-all text-center flex-1`}
                >
                  {account.isReserved ? "Join Waitlist ⏳" : "Buy Now 🚀"}
                </button>

                <a
                  href={`https://wa.me/923098972484?text=Hi, I am interested in this Snapchat account: ${account.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex justify-center items-center text-center"
                >
                  Contact Seller
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
