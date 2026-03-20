import { Outlet } from "react-router-dom";
import Navbar from "./Home/NavBar"; // Path check kar lijiyega
import Footer from "./Home/Footer"; // Path check kar lijiyega

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-snap-dark">
      {/* Frame ka Upar wala hissa */}
      <Navbar />

      {/* Khali Jagah jahan tasveerein (Pages) badlengi */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Frame ka Neechay wala hissa */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
