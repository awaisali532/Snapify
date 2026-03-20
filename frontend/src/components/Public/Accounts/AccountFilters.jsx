import { FaFilter } from "react-icons/fa"; // 1. Professional Icon Import Kiya

const AccountFilters = ({ filters, setFilters }) => {
  // Jab bhi koi filter change ho, yeh function Parent (Main Page) ko bata dega
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-snap-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      {/* PROFESSIONAL TITLE WITH ICON */}
      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
        <FaFilter className="text-snap-yellow" /> Filters
      </h3>

      {/* 1. Snap Score Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm uppercase tracking-wider">
          Snap Score
        </h4>
        <div className="space-y-2">
          {["all", "100k-500k", "500k-1m", "1m+"].map((scoreOpt) => (
            <label
              key={scoreOpt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="score"
                value={scoreOpt}
                checked={filters.score === scoreOpt}
                onChange={handleChange}
                className="w-4 h-4 text-snap-yellow focus:ring-snap-yellow bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white capitalize text-sm transition-colors">
                {scoreOpt === "all"
                  ? "All Scores"
                  : scoreOpt.replace("-", " to ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. FOLLOWERS FILTER (Naya Add Kiya) */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm uppercase tracking-wider">
          Followers
        </h4>
        <div className="space-y-2">
          {["all", "0-10k", "10k-50k", "50k+"].map((follOpt) => (
            <label
              key={follOpt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="followers" // Name update kiya taake state mein 'followers' save ho
                value={follOpt}
                checked={filters.followers === follOpt}
                onChange={handleChange}
                className="w-4 h-4 text-snap-yellow focus:ring-snap-yellow bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white capitalize text-sm transition-colors">
                {follOpt === "all"
                  ? "All Followers"
                  : follOpt.replace("-", " to ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Avatar Type / Gender Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm uppercase tracking-wider">
          Avatar Type
        </h4>
        <div className="space-y-2">
          {["any", "female", "male"].map((genderOpt) => (
            <label
              key={genderOpt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="gender"
                value={genderOpt}
                checked={filters.gender === genderOpt}
                onChange={handleChange}
                className="w-4 h-4 text-snap-yellow focus:ring-snap-yellow bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white capitalize text-sm transition-colors">
                {genderOpt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Sort By Price */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm uppercase tracking-wider">
          Sort By Price
        </h4>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-snap-yellow focus:border-snap-yellow block p-2.5 outline-none cursor-pointer"
        >
          <option value="default">Default</option>
          <option value="low-high">Low to High</option>
          <option value="high-low">High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default AccountFilters;
