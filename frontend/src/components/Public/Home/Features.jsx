const Features = () => {
  // 1. Data Array (Taake HTML messy na ho aur code clean rahay)
  const featuresData = [
    {
      id: 1,
      icon: "🛡️",
      title: "100% Secure & Safe",
      description:
        "Har account mukammal verified hai. Hum safe payments aur complete ownership transfer ki guarantee dete hain.",
    },
    {
      id: 2,
      icon: "⚡",
      title: "Instant Delivery",
      description:
        "No waiting time! Payment confirm hote hi aapko account ke credentials foran (instantly) mil jayenge.",
    },
    {
      id: 3,
      icon: "⭐",
      title: "Verified Inventory",
      description:
        "Hum strict checking karte hain. Aapko sirf authentic, high-score accounts milenge jin par koi ban ya restriction nahi hogi.",
    },
  ];

  return (
    // py-20 se upar neechay acchi khasi breathing space milegi
    <section className="w-full py-20 bg-white dark:bg-snap-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-snap-yellow">
              Snapify?
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hum internet par premium Snapchat accounts ka sab se bara aur
            bharosemand (trusted) platform hain.
          </p>
        </div>

        {/* Cards Grid: Mobile par 1 column, PC par 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Loop through features array */}
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-gray-50 dark:bg-snap-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-snap-yellow dark:hover:border-snap-yellow transition-all duration-300 cursor-pointer"
            >
              {/* Card Glow Effect on Hover (Hidden by default, shows on group-hover) */}
              <div className="absolute inset-0 bg-linear-to-br from-snap-yellow/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>

              {/* Icon Box */}
              <div className="w-16 h-16 mb-6 rounded-xl bg-white dark:bg-snap-dark shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
