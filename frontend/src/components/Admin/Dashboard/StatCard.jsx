const StatCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-snap-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
      {/* Icon Wrapper */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
      >
        {icon}
      </div>

      {/* Text Info */}
      <div>
        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">
          {title}
        </h4>
        <div className="text-3xl font-black text-gray-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
