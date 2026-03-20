import { createContext, useState, useEffect } from "react";

// 1. Loudspeaker (Context) create kiya
export const AuthContext = createContext();

// 2. Provider Component (Jo poori app ko data dega)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Taa ke jab tak data check ho, app ruki rahay

  // App start hotay hi check karo ke kya user pehle se logged in hai (localStorage mein)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function: State aur LocalStorage dono mein data save karega
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Logout function: State aur LocalStorage dono se data uda dega
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}{" "}
      {/* Jab tak loading true hai, kuch render mat karo */}
    </AuthContext.Provider>
  );
};
