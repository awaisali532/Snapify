import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaList,
  FaArrowLeft,
  FaTimes,
  FaBox,
  FaStar,
  FaBolt,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Add Account", path: "/admin/add-account", icon: <FaPlus /> },
    {
      name: "Manage Accounts",
      path: "/admin/manage-accounts",
      icon: <FaList />,
    },
    { name: "Manage Orders", path: "/admin/manage-orders", icon: <FaBox /> },
    { name: "Manage Reviews", path: "/admin/manage-reviews", icon: <FaStar /> },
    {
      name: "Score Packages",
      path: "/admin/manage-packages",
      icon: <FaBolt />,
    },
    {
      name: "Payment Methods",
      path: "/admin/payment-methods",
      icon: <FaMoneyCheckAlt />,
    },
  ];

  // ==========================================
  // NAYA JADOO: Same Page Refresh Logic
  // ==========================================
  const handleNavClick = (e, path) => {
    // 1. Mobile menu ko band karo
    setIsSidebarOpen(false);

    // 2. Agar current page wahi hai jahan jana hai, toh Refresh maro
    if (location.pathname === path) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-snap-card border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:inset-auto md:shrink-0`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <span className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-snap-yellow">⚡</span> SnapAdmin
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                // NAYA JADOO APPLY KIYA:
                onClick={(e) => handleNavClick(e, item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive
                    ? "bg-yellow-500 dark:bg-snap-yellow text-black shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span
                  className={`text-lg ${isActive ? "text-black" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors font-bold"
          >
            <FaArrowLeft className="text-gray-400 dark:text-gray-500 text-lg" />
            View Website
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
