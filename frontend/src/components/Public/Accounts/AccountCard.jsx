import { Link } from "react-router-dom";
import { FaFire, FaVenusMars, FaStar, FaUsers } from "react-icons/fa";
import { useContext } from "react";
import { CurrencyContext } from "../../../context/CurrencyContext";
import { formatNumber } from "../../../utils/formatters";

const AccountCard = ({ account }) => {
  const { currency, symbols, calculatePrice } = useContext(CurrencyContext);

  return (
    <div className="bg-white dark:bg-snap-card rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 group flex flex-col h-full">
      {/* 1. Cropped Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
        <img
          // JADOO: DB se 'images' ka array aata hai, isliye pehli image [0] uthayi
          src={
            account.images && account.images.length > 0 ? account.images[0] : ""
          }
          alt="Snapchat Account"
          className="w-full h-full object-fit object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <FaFire className="text-snap-yellow" />
          {formatNumber(account.score)} Score
        </div>
      </div>

      {/* 2. Details Section */}
      <div className="p-5 flex flex-col grow">
        <div className="mb-3">
          <h3
            className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1"
            title={account.title}
          >
            {account.title}
          </h3>
          <div className="text-2xl font-black text-snap-dark dark:text-snap-yellow">
            {symbols[currency]} {calculatePrice(account.price)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 mt-auto pt-2">
          <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded flex items-center gap-1.5 font-medium">
            <FaUsers /> {formatNumber(account.followers || 0)}
          </span>

          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded flex items-center gap-1.5 font-medium capitalize">
            <FaVenusMars /> {account.gender}
          </span>

          <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-1 rounded flex items-center gap-1.5 font-medium">
            <FaStar /> Premium
          </span>
        </div>

        <Link
          // JADOO: MongoDB ki id '_id' hoti hai
          to={`/account/${account._id}`}
          className="block w-full text-center py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-snap-yellow dark:hover:bg-snap-yellow hover:text-black dark:hover:text-black transition-colors duration-300 mt-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AccountCard;
