import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-snap-dark border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* 1. Brand Section */}
        <div className="md:col-span-2 space-y-4">
          <Link
            to="/"
            className="text-3xl font-bold text-snap-dark dark:text-snap-yellow tracking-wider inline-block"
          >
            Snapify ⚡
          </Link>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
            The ultimate destination for premium Snapchat accounts. Get instant
            delivery, high snap scores, and 100% secure ownership transfers.
            Level up your social presence today.
          </p>
        </div>

        {/* 2. Quick Links Section */}

        {/* 3. Support / Legal Section */}
        {/* 2. Quick Links Section */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h4>
          <ul className="space-y-4 font-medium">
            <li>
              <Link
                to="/"
                className="group relative inline-block text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow transition-colors"
              >
                Home
                {/* YAHAN CHANGE KIYA HAI: bg-snap-dark dark:bg-snap-yellow */}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-snap-dark dark:bg-snap-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/accounts"
                className="group relative inline-block text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow transition-colors"
              >
                Explore Inventory
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-snap-dark dark:bg-snap-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="group relative inline-block text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow transition-colors"
              >
                Trusted Reviews
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-snap-dark dark:bg-snap-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Support / Legal Section */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Support & Legal
          </h4>
          <ul className="space-y-4 font-medium">
            <li>
              <Link
                to="/faq"
                className="group relative inline-block text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow transition-colors"
              >
                FAQs
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-snap-dark dark:bg-snap-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="group relative inline-block text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow transition-colors"
              >
                Contact Us
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-snap-dark dark:bg-snap-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="group relative inline-block text-gray-600 dark:text-gray-400 hover:text-snap-dark dark:hover:text-snap-yellow transition-colors"
              >
                Terms of Service
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-snap-dark dark:bg-snap-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Text */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Snapify. All rights reserved. Not
          affiliated with Snap Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
