import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "../../../hooks/useDarkMode";
import { CurrencyContext } from "../../../context/CurrencyContext";
import { AuthContext } from "../../../context/AuthContext";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Accounts", path: "/accounts" },
  { name: "Reviews", path: "/reviews" },
  { name: "Boosting", path: "/boosting" }, // Boosting pehle se yahan hai!
];

const CURRENCIES = [
  { code: "PKR", label: "PKR 🇵🇰" },
  { code: "USD", label: "USD 🇺🇸" },
  { code: "GBP", label: "GBP 🇬🇧" },
  { code: "EUR", label: "EUR 🇪🇺" },
  { code: "BDT", label: "TK 🇧🇩" },
];

const Navbar = () => {
  const [colorTheme, setTheme] = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMode = () => setTheme(colorTheme);
  const closeMenu = () => setIsMenuOpen(false);

  const { currency, setCurrency } = useContext(CurrencyContext);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const buttonText = isLoginPage ? "Sign Up" : "Login";
  const buttonLink = isLoginPage ? "/register" : "/login";

  // ==========================================
  // NAYA JADOO: Same Page Refresh Logic
  // ==========================================
  const handleNavClick = (e, path, isMobile = false) => {
    if (isMobile) closeMenu();

    if (location.pathname === path) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <nav className="w-full relative bg-white dark:bg-snap-card shadow-sm transition-colors duration-300 z-50">
      <div className="px-6 md:px-12 py-3 flex justify-between items-center">
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="flex items-center"
        >
          <img
            src="/logo-Horizental.png"
            alt="Snapify Logo"
            className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex space-x-8 font-medium items-center">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                // NAYA JADOO APPLY KIYA:
                onClick={(e) => handleNavClick(e, link.path)}
                className={`transition-all duration-300 py-1 flex items-center gap-1 ${
                  isActive
                    ? "text-yellow-600 dark:text-snap-yellow border-b-2 border-yellow-600 dark:border-snap-yellow font-bold"
                    : "text-gray-800 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-snap-yellow"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow transition"
          >
            {CURRENCIES.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.label}
              </option>
            ))}
          </select>

          <button
            onClick={toggleMode}
            className="p-2 text-xl rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
          >
            {colorTheme === "light" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={(e) => handleNavClick(e, "/admin")}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 dark:bg-snap-yellow text-black text-sm font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  ⚡ Dashboard
                </Link>
              )}

              {user.role !== "admin" && (
                <Link
                  to="/my-orders"
                  onClick={(e) => handleNavClick(e, "/my-orders")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  📦 My Orders
                </Link>
              )}

              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=facc15&color=000&bold=true`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full shadow-sm"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-white hidden lg:block">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={buttonLink}
              className="px-5 py-2 border-2 border-yellow-600 text-yellow-600 dark:border-snap-yellow dark:text-snap-yellow font-semibold rounded-lg hover:bg-yellow-600 hover:text-white dark:hover:bg-snap-yellow dark:hover:text-black transition duration-300"
            >
              {buttonText}
            </Link>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleMode} className="text-xl">
            {colorTheme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-snap-dark dark:text-snap-text focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40"
          onClick={closeMenu}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-snap-card shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-5 right-6 text-snap-dark dark:text-snap-text hover:text-red-500 transition"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col mt-20 px-6 space-y-6 text-lg font-medium">
          <div className="mb-4">
            <img src="/logo-Horizental.png" alt="Logo" className="h-8 w-auto" />
          </div>

          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                // NAYA JADOO APPLY KIYA (Mobile = true):
                onClick={(e) => handleNavClick(e, link.path, true)}
                className={`transition-all duration-300 flex items-center gap-2 ${isActive ? "text-yellow-600 dark:text-snap-yellow font-bold pl-3 border-l-4 border-yellow-600 dark:border-snap-yellow" : "text-gray-800 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-snap-yellow"}`}
              >
                {link.name}
              </Link>
            );
          })}

          <hr className="border-gray-300 dark:border-gray-700" />

          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              Currency
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-snap-yellow transition"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.label}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />

          {user ? (
            <div className="flex flex-col gap-4">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={(e) => handleNavClick(e, "/admin", true)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 dark:bg-snap-yellow text-black font-bold rounded-lg shadow-sm hover:bg-yellow-400 transition-all duration-300"
                >
                  ⚡ Go to Dashboard
                </Link>
              )}

              {user.role !== "admin" && (
                <Link
                  to="/my-orders"
                  onClick={(e) => handleNavClick(e, "/my-orders", true)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  📦 My Orders
                </Link>
              )}

              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=facc15&color=000&bold=true`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold text-gray-800 dark:text-white">
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="text-left font-bold text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={buttonLink}
              onClick={closeMenu}
              className="text-center w-full py-3 border-2 border-yellow-600 text-yellow-600 dark:border-snap-yellow dark:text-snap-yellow font-semibold rounded-lg hover:bg-yellow-600 hover:text-white dark:hover:bg-snap-yellow dark:hover:text-black transition duration-300"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
