import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/users/login`, {
        identifier,
        password,
      });

      const userData = response.data;

      // First name nikalne ka logic
      const firstName = userData.name ? userData.name.split(" ")[0] : "";

      // Context ka login function call kiya
      login(userData, userData.token);

      // ==========================================
      // JADOO: Role Check kar ke rasta tay karna
      // ==========================================
      const redirectPath = userData.role === "admin" ? "/admin" : "/accounts";

      // Popup mein dynamic name laga diya
      Swal.fire({
        title: `Welcome Back, ${firstName}! ⚡`,
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonColor: "#facc15",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // User ko uske naye raste par bhej do
        navigate(redirectPath);
      });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Server is down. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-10 w-72 h-72 bg-snap-yellow/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-snap-yellow/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-snap-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/logo-Square.png"
              alt="Snapify Logo"
              className="h-24 w-auto mx-auto hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Log in to manage your premium accounts.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded transition-all">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@gmail.com or ali_snapking"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-snap-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-snap-yellow transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-snap-dark dark:text-snap-yellow hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 dark:bg-snap-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-snap-yellow transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-snap-dark dark:hover:text-snap-yellow focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-xl" />
                ) : (
                  <FaEye className="text-xl" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-bold rounded-lg shadow-lg transition-all duration-300 ${loading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-snap-yellow text-black hover:shadow-yellow-500/30 hover:-translate-y-1"}`}
            >
              {loading ? "Logging in..." : "Log In 🚀"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-snap-dark dark:text-snap-yellow hover:underline"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
