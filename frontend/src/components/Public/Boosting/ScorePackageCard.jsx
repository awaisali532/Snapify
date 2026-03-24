import { useContext } from "react";
import { FaCheckCircle, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CurrencyContext } from "../../../context/CurrencyContext";

const ScorePackageCard = ({ pkg }) => {
  const { calculatePrice, symbols, currency } = useContext(CurrencyContext); // 🟡 Context Use Kiya

  return (
    <div className="bg-white dark:bg-snap-card rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FaBolt className="text-gray-400" /> {pkg.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Delivery: {pkg.deliveryTime}
        </p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-black text-gray-900 dark:text-white">
          {/* 🟡 NAYA JADOO: Dynamic Price */}
          {symbols[currency]} {calculatePrice(pkg.price)}
        </span>
      </div>

      <div className="grow">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Package Includes:
        </p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <FaCheckCircle className="text-yellow-500 dark:text-snap-yellow mt-0.5 shrink-0" />
            <span>+{pkg.scoreAmount.toLocaleString()} Snap Score</span>
          </li>
          {pkg.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm"
            >
              <FaCheckCircle className="text-yellow-500 dark:text-snap-yellow mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={`/boosting/checkout/${pkg._id}`}
        className="w-full block text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        Select Package
      </Link>
    </div>
  );
};

export default ScorePackageCard;
