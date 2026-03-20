import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Hero = () => {
  // 1. State for checking visibility
  const [isVisible, setIsVisible] = useState(true);

  // 2. Ref to target the exact bouncing card div
  const cardRef = useRef(null);

  useEffect(() => {
    // 3. Setup the Intersection Observer (The Camera)
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Agar screen par nazar aa raha hai toh true, warna false
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // 10% element bhi nazar aaye toh 'visible' maan lo
      },
    );

    // 4. Camera ko batao ke kis element ko dekhna hai
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    // 5. Cleanup function (Jab component hatega toh camera band kar do)
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    // min-h-[calc(100vh-80px)] ensures ke hero section poori screen cover kare (navbar ki height nikal kar)
    <section className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-snap-dark transition-colors duration-300 px-6 md:px-12 py-12 md:py-0">
      {/* Background Glow Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-snap-yellow/20 dark:bg-snap-yellow/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-snap-yellow/20 dark:bg-snap-yellow/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Main Content Grid: Mobile par 1 column, PC par 2 columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10 w-full">
        {/* Left Side: Text & Buttons */}
        <div className="text-center md:text-left space-y-6 md:space-y-8">
          {/* The Big Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            Level Up Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-snap-yellow">
              Social Presence
            </span>{" "}
            <br className="hidden md:block" />
            Instantly.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
            Buy premium, secure, and high-score Snapchat accounts with instant
            delivery. Build trust and go viral today.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <Link
              to="/accounts"
              className="w-full sm:w-auto px-8 py-4 bg-snap-yellow text-black text-center font-bold rounded-lg shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              Explore Inventory 🚀
            </Link>
            <Link
              to="/reviews"
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-center font-semibold rounded-lg hover:border-snap-yellow hover:text-snap-dark dark:hover:border-snap-yellow dark:hover:text-snap-yellow transition-all duration-300"
            >
              See Trusted Reviews
            </Link>
          </div>
        </div>

        {/* Right Side: The Floating 3D Graphic */}
        {/* Right Side: The Floating 3D Graphic */}
        {/* 1. OUTER WRAPPER (The Camera Target - Stays still) */}
        <div
          ref={cardRef}
          className="relative hidden md:flex justify-center items-center mt-10 md:mt-0 w-full"
        >
          {/* 2. INNER ANIMATED WRAPPER (The Moving Object - Bounces safely inside) */}
          <div
            className={`w-full max-w-sm flex justify-center ${isVisible ? "animate-[bounce_4s_infinite]" : ""}`}
          >
            {/* The Card Design (Aapka baki card design wese ka wesa hi hai) */}
            <div className="relative w-full bg-white dark:bg-snap-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 backdrop-blur-sm transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Profile Area */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-linear-to-tr from-yellow-300 to-snap-yellow rounded-full flex items-center justify-center border-4 border-white dark:border-snap-dark shadow-inner">
                  <span className="text-3xl">👻</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pro Snap
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @snap_king26
                  </p>
                </div>
              </div>

              {/* High Score Highlight Container */}
              <div className="bg-gray-50 dark:bg-snap-dark rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">
                  Snap Score
                </p>
                <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-snap-yellow">
                  500,000+
                </p>
              </div>

              {/* Trust Badges */}
              <div className=" mt-6 flex flex-wrap justify-center gap-2">
                <span className=" px-3 py-1 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  ✓ Verified
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                  ⚡ Instant Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
