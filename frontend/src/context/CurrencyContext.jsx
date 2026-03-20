import { createContext, useState, useEffect } from "react";
import axios from "axios"; // API call ke liye

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    localStorage.getItem("snapify_currency") || "PKR",
  );

  // 1. Rates ki state (Shuru mein sirf PKR=1 rakha hai)
  const [rates, setRates] = useState({ PKR: 1 });
  const [isRatesLoaded, setIsRatesLoaded] = useState(false);

  // 2. Symbols hamesha fixed rehte hain, isliye inko yahin rakha
  const symbols = { PKR: "Rs", USD: "$", GBP: "£", EUR: "€", BDT: "৳" };

  const calculatePrice = (price) => {
    if (!isRatesLoaded || !rates[currency]) return "...";

    return (price * rates[currency]).toLocaleString(undefined, {
      minimumFractionDigits: currency === "PKR" ? 0 : 2,
      maximumFractionDigits: currency === "PKR" ? 0 : 2,
    });
  };
  // ==========================================
  // LIVE API CALL (Real-time Currency Fetcher)
  // ==========================================
  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        // Yeh free API hai jo PKR ke hisab se saari duniya ke rates degi
        const response = await axios.get(
          "https://open.er-api.com/v6/latest/PKR",
        );

        // API se aane wale live rates ko state mein save kar liya
        setRates(response.data.rates);
        setIsRatesLoaded(true);
      } catch (error) {
        console.error("Live Rates load nahi ho sake:", error);

        setIsRatesLoaded(true);
      }
    };

    fetchLiveRates();
  }, []); // [] ka matlab hai yeh jadoo sirf website load hone par ek dafa chalega

  useEffect(() => {
    localStorage.setItem("snapify_currency", currency);
  }, [currency]);

  return (
    // isRatesLoaded ko bhi bhej diya taake Cards tab tak intezar karein jab tak rates na aajayen
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        symbols,
        isRatesLoaded,
        calculatePrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
