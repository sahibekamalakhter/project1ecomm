import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-start justify-between gap-3 border-b-2 border-blue-900 bg-blue-100 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
      <h2 className="text-xl font-bold text-blue-900">Simple Shop</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/" className="font-semibold text-blue-900 hover:text-blue-700">
          Home
        </Link>

        {!isLoggedIn && (
          <Link to="/login" className="font-semibold text-blue-900 hover:text-blue-700">
            Login
          </Link>
        )}
        {!isLoggedIn && (
          <Link to="/register" className="font-semibold text-blue-900 hover:text-blue-700">
            Register
          </Link>
        )}

        {isLoggedIn && user && user.role === "buyer" && (
          <Link to="/cart" className="font-semibold text-blue-900 hover:text-blue-700">
            Cart
          </Link>
        )}
        {isLoggedIn && user && user.role === "seller" && (
          <Link to="/seller" className="font-semibold text-blue-900 hover:text-blue-700">
            Seller Dashboard
          </Link>
        )}

        {isLoggedIn && (
          <button
            className="rounded border border-blue-900 bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
