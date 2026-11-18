import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });
  const [cartItems, setCartItems] = useState([]);

  const isLoggedIn = token ? true : false;

  function loginUser(tokenValue, userValue) {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  }

  function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setCartItems([]);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn,
        cartItems,
        setCartItems,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
