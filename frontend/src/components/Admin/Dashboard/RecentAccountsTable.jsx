import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../../../context/CurrencyContext";
import { FaSnapchatGhost } from "react-icons/fa";

const RecentAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { symbols, currency, calculatePrice } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchRecentAccounts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        // Hum accounts fetch kar rahe hain
        const response = await axios.get(`${API_URL}/api/accounts`);

        if (response.data.success) {
          // Sirf latest 5 accounts dikhayenge taake dashboard clean rahe
          setAccounts(response.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching recent accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAccounts();
  }, []);

  const displaySymbol = symbols[currency] || "Rs";

  if (loading) {
    return (
      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaSnapchatGhost className="text-snap-yellow" />
          Recently Added Accounts
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-sm">
              <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                Account Title
              </th>
              <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                Price
              </th>
              <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                Date Added
              </th>
              <th className="p-4 font-bold text-gray-700 dark:text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {accounts.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No accounts found in the store.
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition"
                >
                  <td className="p-4">
                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                      {account.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Snap Score: {account.snapScore}
                    </p>
                  </td>
                  <td className="p-4 font-black text-snap-dark dark:text-snap-yellow">
                    {displaySymbol} {calculatePrice(account.price)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(account.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        account.isSold
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {account.isSold ? "Sold Out" : "Available"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAccountsTable;
