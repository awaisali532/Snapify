import { FaCheckCircle, FaFire } from "react-icons/fa";
import { Link } from "react-router-dom";

const OfferPackageCard = ({ pkg }) => {
  return (
    <div className="bg-linear-to-b from-yellow-50 to-white dark:from-yellow-900/10 dark:to-snap-card rounded-3xl p-8 border-2 border-yellow-500 dark:border-snap-yellow shadow-xl md:-translate-y-4 hover:-translate-y-6 transition-transform flex flex-col h-full relative z-10">
      {/* VIP BADGE */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 dark:bg-snap-yellow text-black font-black text-xs uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
        <FaFire className="text-red-500" /> Special Offer
      </div>

      <div className="mb-6 mt-2">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          {pkg.title}
        </h3>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-bold">
          ⚡ Fast Delivery: {pkg.deliveryTime}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1 font-medium">
          Regular Price: Rs. {pkg.price}
        </p>
        <span className="text-5xl font-black text-yellow-500 dark:text-snap-yellow">
          Rs. {pkg.offerPrice}
        </span>
      </div>

      <div className="grow">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Premium Features:
        </p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
            <FaCheckCircle className="text-yellow-500 dark:text-snap-yellow mt-0.5 shrink-0" />
            <span>
              +{pkg.scoreAmount.toLocaleString()} Snap Score Guarantee
            </span>
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
        className="w-full block text-center bg-yellow-500 dark:bg-snap-yellow hover:bg-yellow-600 dark:hover:bg-yellow-400 text-black font-black py-4 rounded-xl shadow-lg shadow-yellow-500/30 transition-all"
      >
        Claim Offer Now
      </Link>
    </div>
  );
};

export default OfferPackageCard;
