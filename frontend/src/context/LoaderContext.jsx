import { createContext, useState } from "react";
import { FaGhost } from "react-icons/fa"; // Snap Ghost Icon

// 1. Context Create Kiya
export const LoaderContext = createContext();

// 2. Provider Component
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // Loader ON karne ka function (Sath custom text bhi de sakte hain)
  const showLoader = (text = "Loading...") => {
    setLoadingText(text);
    setIsLoading(true);
  };

  // Loader OFF karne ka function
  const hideLoader = () => {
    setIsLoading(false);
    setLoadingText("");
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}

      {/* ==========================================
          THE VIP GLOBAL LOADER OVERLAY
          ========================================== */}
      {isLoading && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
          {/* Custom CSS Animation for Zoom In/Out */}
          <style>{`
            @keyframes zoomInOut {
              0%, 100% { transform: scale(0.85); }
              50% { transform: scale(1.15); filter: drop-shadow(0 0 20px #FFFC00); }
            }
            .animate-zoom { animation: zoomInOut 1.5s ease-in-out infinite; }
          `}</style>

          <div className="relative flex items-center justify-center w-36 h-36 mb-6">
            {/* 1. Ghoomta Hua Spinner (Outer Ring) */}
            <div className="absolute inset-0 border-4 border-transparent border-t-snap-yellow border-b-snap-yellow rounded-full animate-spin"></div>

            {/* 2. Andar wala Spinner (Opposite direction mein ghoome ga) */}
            <div className="absolute inset-4 border-4 border-transparent border-l-snap-yellow opacity-50 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

            {/* 3. Snap Ghost Logo (Zoom In/Out Effect ke sath) */}
            <FaGhost className="text-snap-yellow text-6xl animate-zoom" />
          </div>

          {/* 4. Dynamic Text (Deleting..., Adding...) */}
          <p className="text-snap-yellow text-xl font-black tracking-widest uppercase animate-pulse">
            {loadingText}
          </p>
        </div>
      )}
    </LoaderContext.Provider>
  );
};
