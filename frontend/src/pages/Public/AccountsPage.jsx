import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaFilter } from "react-icons/fa";

import AccountCard from "../../components/Public/Accounts/AccountCard";
import AccountFilters from "../../components/Public/Accounts/AccountFilters";

const parseScore = (scoreStr) => {
  if (!scoreStr) return 0;
  let s = scoreStr.toString().toLowerCase().replace(/,/g, "");
  if (s.includes("m")) return parseFloat(s) * 1000000;
  if (s.includes("k")) return parseFloat(s) * 1000;
  return parseFloat(s) || 0;
};

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    score: "all",
    followers: "all",
    gender: "any",
    sort: "default",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/accounts`);
        setAccounts(response.data.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load accounts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // Note: API already filters out isSold: true accounts, so we only see Available and Reserved here.
    if (filters.gender !== "any") {
      result = result.filter(
        (acc) => acc.gender?.toLowerCase() === filters.gender.toLowerCase(),
      );
    }

    if (filters.score !== "all") {
      result = result.filter((a) => {
        const numScore = parseScore(a.score);
        if (filters.score === "100k-500k")
          return numScore >= 100000 && numScore <= 500000;
        if (filters.score === "500k-1m")
          return numScore > 500000 && numScore <= 1000000;
        if (filters.score === "1m+") return numScore > 1000000;
        return true;
      });
    }

    if (filters.followers !== "all") {
      result = result.filter((a) => {
        const fols = a.followers || 0;
        if (filters.followers === "0-10k") return fols >= 0 && fols <= 10000;
        if (filters.followers === "10k-50k")
          return fols > 10000 && fols <= 50000;
        if (filters.followers === "50k+") return fols > 50000;
        return true;
      });
    }

    if (filters.sort === "low-high") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "high-low") result.sort((a, b) => b.price - a.price);

    return result;
  }, [filters, accounts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-snap-dark py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Premium Accounts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browse our collection of high-score, 100% secure Snapchat accounts.
          </p>
        </div>

        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-snap-card border border-gray-200 dark:border-gray-700 py-3 rounded-xl shadow-sm text-gray-800 dark:text-white font-semibold"
          >
            <FaFilter className="text-yellow-500 dark:text-snap-yellow" />
            {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg text-red-700 dark:text-red-400 text-center font-bold w-full">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col md:flex-row gap-8">
            <div
              className={`w-full md:w-1/4 ${isMobileFilterOpen ? "block" : "hidden md:block"}`}
            >
              <AccountFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="w-full md:w-3/4">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-snap-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    No accounts found matching your filters. 😢
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        score: "all",
                        followers: "all",
                        gender: "any",
                        sort: "default",
                      })
                    }
                    className="text-yellow-500 dark:text-snap-yellow font-bold hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAccounts.map((account) => (
                    <AccountCard key={account._id} account={account} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
