import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// 1. React Icons import kiye
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // ==========================================
    // THE FRONTEND SECURITY GUARD
    // ==========================================
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, one UPPERCASE, one lowercase, one number, and one special character.",
      );
      return; // Yahan se aage mat barho!
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      // Axios backend par request bhej raha hai
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        username,
        email,
        password,
      });

      // Agar try block kamyab ho gaya, toh SweetAlert dikhao
      Swal.fire({
        title: "Welcome to Snapify! ⚡",
        text: "Your account has been created successfully.",
        icon: "success",
        confirmButtonColor: "#facc15",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } catch (err) {
      // Agar backend se error aaya (catch block chal gaya)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-snap-dark p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-snap-yellow/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-snap-yellow/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-snap-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/logo-Square.png"
              alt="Snapify Logo"
              className="h-24 w-auto mx-auto hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Register Account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Join the premium Snapchat community.
          </p>
        </div>

        {/* ERROR MESSAGE DIKHANE KI JAGAH */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded transition-all">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Raza"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-snap-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-snap-yellow transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ali_snapking"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-snap-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-snap-yellow transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-snap-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-snap-yellow transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 symbol, 1 number"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 dark:bg-snap-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-snap-yellow transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-snap-dark dark:hover:text-snap-yellow focus:outline-none transition-colors"
              >
                {/* 2. React Icons Use Kiye */}
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
              {loading ? "Registering..." : "Register 🚀"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-snap-dark dark:text-snap-yellow hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
