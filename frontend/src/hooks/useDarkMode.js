import { useState, useEffect } from "react";

export default function useDarkMode() {
  // 1. LocalStorage se check karo ke user ne pehle kya select kiya tha, warna default 'dark' rakho
  const [theme, setTheme] = useState(localStorage.theme || "dark");

  // 2. Jo current theme hai, uske opposite color theme nikal lo (toggle karne ke liye)
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement; // Yeh HTML tag ko pakarta hai

    // 3. Purani class hatao aur nayi class add karo (<html class="dark">)
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    // 4. User ki choice ko browser ki memory (localStorage) mein save kar do
    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);

  return [colorTheme, setTheme];
}
