import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaBoxes,
  FaMoneyBillWave,
  FaShoppingCart,
  FaClock,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/Admin/Dashboard/StatCard";
import RecentAccountsTable from "../../components/Admin/Dashboard/RecentAccountsTable";
import { AuthContext } from "../../context/AuthContext";
import { CurrencyContext } from "../../context/CurrencyContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { symbols, currency, calculatePrice } = useContext(CurrencyContext);
  const firstName = user?.name ? user.name.split(" ")[0] : "Admin";

  const [stats, setStats] = useState({
    totalAccounts: 0,
    soldAccounts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    chartData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/orders/stats/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displaySymbol = symbols[currency] || "Rs";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snap-dark dark:border-snap-yellow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Dashboard Overview 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
          Welcome back,{" "}
          <span className="text-snap-dark dark:text-snap-yellow font-bold">
            {firstName}
          </span>
          ! Here are your live store analytics.
        </p>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`${displaySymbol} ${calculatePrice(stats.totalRevenue)}`}
          icon={<FaMoneyBillWave size={24} />}
          colorClass="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={<FaClock size={24} />}
          colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          title="Total Accounts"
          value={stats.totalAccounts.toString()}
          icon={<FaBoxes size={24} />}
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="Accounts Sold"
          value={stats.soldAccounts.toString()}
          icon={<FaShoppingCart size={24} />}
          colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      {/* REVENUE CHART 📈 */}
      <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Revenue Over Time
        </h2>
        {stats.chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${displaySymbol}${value}`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [
                    `${displaySymbol} ${value}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#facc15"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 font-medium">
              No revenue data yet. Verify some orders!
            </p>
          </div>
        )}
      </div>

      <RecentAccountsTable />
    </div>
  );
};

export default AdminDashboard;
