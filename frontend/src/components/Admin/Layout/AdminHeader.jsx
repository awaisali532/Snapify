import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import useDarkMode from "../../../hooks/useDarkMode";
import { AuthContext } from "../../../context/AuthContext";

const AdminHeader = ({ setIsSidebarOpen }) => {
  const [colorTheme, setTheme] = useDarkMode();
  const toggleMode = () => setTheme(colorTheme);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const adminUser = user || { name: "Admin", role: "admin" };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-snap-card h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300 z-30 sticky top-0 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow focus:outline-none p-2 -ml-2 rounded-lg transition-colors"
        >
          <FaBars size={22} />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          onClick={toggleMode}
          className="p-2 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300 text-gray-600 dark:text-gray-300"
          title="Toggle Dark Mode"
        >
          {colorTheme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">
              {adminUser.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              {adminUser.role}
            </span>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${adminUser.name}&background=facc15&color=000&bold=true`}
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm"
          />

          {/* Admin Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 text-red-500 hover:text-red-700 transition p-2 bg-red-50 dark:bg-red-500/10 rounded-full"
            title="Logout"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
