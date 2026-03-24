import { useContext } from "react";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CurrencyContext } from "../../../context/CurrencyContext"; // 🟡 NAYA JADOO

const PopularPackageCard = ({ pkg }) => {
  const { calculatePrice, symbols, currency } = useContext(CurrencyContext); // 🟡 Context Use Kiya

  return (
    <div className="bg-white dark:bg-snap-card rounded-3xl p-8 border-2 border-blue-500 dark:border-blue-400 shadow-xl md:-translate-y-4 hover:-translate-y-6 transition-transform flex flex-col h-full relative z-10">
      {/* ⭐ MOST POPULAR BADGE */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white font-black text-xs uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
        <FaStar className="text-yellow-300" /> Most Popular
      </div>

      <div className="mb-6 mt-2">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          {pkg.title}
        </h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-bold">
          Delivery: {pkg.deliveryTime}
        </p>
      </div>

      <div className="mb-6">
        <span className="text-5xl font-black text-blue-500 dark:text-blue-400">
          {/* 🟡 NAYA JADOO: Dynamic Price */}
          {symbols[currency]} {calculatePrice(pkg.price)}
        </span>
      </div>

      <div className="grow">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Why it's the Best Value:
        </p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
            <FaCheckCircle className="text-blue-500 mt-0.5 shrink-0" />
            <span>+{pkg.scoreAmount.toLocaleString()} Snap Score</span>
          </li>
          {pkg.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm"
            >
              <FaCheckCircle className="text-blue-500 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={`/boosting/checkout/${pkg._id}`}
        className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
      >
        Choose Popular
      </Link>
    </div>
  );
};

export default PopularPackageCard;
