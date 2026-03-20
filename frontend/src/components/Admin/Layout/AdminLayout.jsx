import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  // Mobile par sidebar shuru mein band rahega
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Main Wrapper: Poori screen gheray ga aur scroll ko rokega (h-screen, overflow-hidden)
    <div className="flex h-screen w-full bg-gray-50 dark:bg-snap-dark font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* ==========================================
          1. LEFT SIDE: Sidebar Component
          ========================================== */}
      {/* Humne dono props bheje taake andar se sidebar khud ko band kar sake */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* ==========================================
          2. RIGHT SIDE: Main Content Area
          ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* Asli Page Content (Jo link par click karne se badlega) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
          {/* Outlet ka jadoo: React Router yahan par Dashboard ya Add Account page render karega */}
          <div className="max-w-7xl mx-auto w-full pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
