// ...existing code...
import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // optional: react to token changes or rehydrate from other sources
  }, []);

  function login(newToken) {
    setToken(newToken);
    try {
      localStorage.setItem("token", newToken);
    } catch {}
  }

  function logout() {
    setToken(null);
    try {
      localStorage.removeItem("token");
    } catch {}
  }

  const authData = {
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
// ...existing code...
