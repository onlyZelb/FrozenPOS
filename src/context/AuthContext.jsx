import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [loading, setLoading] = useState(true); // <--- new

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    const savedFirstName = localStorage.getItem("firstName");
    const savedLastName = localStorage.getItem("lastName");

    if (savedToken) setToken(savedToken);
    if (savedUsername) setUsername(savedUsername);
    if (savedFirstName) setFirstName(savedFirstName);
    if (savedLastName) setLastName(savedLastName);

    setLoading(false); // finished loading
  }, []);

  function login(newToken, newUsername, newFirstName = "", newLastName = "") {
    setToken(newToken);
    setUsername(newUsername);
    setFirstName(newFirstName);
    setLastName(newLastName);

    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("firstName", newFirstName);
    localStorage.setItem("lastName", newLastName);
  }

  function logout() {
    setToken(null);
    setUsername(null);
    setFirstName(null);
    setLastName(null);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
  }

  return (
    <AuthContext.Provider
      value={{ token, username, firstName, lastName, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
