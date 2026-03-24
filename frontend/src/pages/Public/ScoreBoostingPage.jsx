import { useState, useEffect } from "react";
import axios from "axios";
import ScorePackageCard from "../../components/Public/Boosting/ScorePackageCard";
import OfferPackageCard from "../../components/Public/Boosting/OfferPackageCard";
// NAYA JADOO: Popular Component Import kiya
import PopularPackageCard from "../../components/Public/Boosting/PopularPackageCard";

const ScoreBoostingPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/score-packages`);
        if (response.data.success) {
          setPackages(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching score packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-snap-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-snap-dark py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Boost Your{" "}
            <span className="text-yellow-500 dark:text-snap-yellow">
              Snap Score
            </span>{" "}
            Safely.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Don't want to buy a new account? No worries! Choose a package below
            and we will boost your personal account's score with 100% safety.
          </p>
        </div>

        {/* PACKAGES GRID */}
        {packages.length === 0 ? (
          <div className="text-center bg-white dark:bg-snap-card rounded-3xl p-12 border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Packages Coming Soon!
            </h3>
            <p className="text-gray-500">
              We are currently updating our boosting packages. Check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center mt-12">
            {packages.map((pkg) => (
              <div key={pkg._id}>
                {/* 🟡 NAYA JADOO: 3 Conditions lagayin hain */}
                {pkg.isOffer ? (
                  <OfferPackageCard pkg={pkg} />
                ) : pkg.isPopular ? (
                  <PopularPackageCard pkg={pkg} />
                ) : (
                  <ScorePackageCard pkg={pkg} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBoostingPage;
