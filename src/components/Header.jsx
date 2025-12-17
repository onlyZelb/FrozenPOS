import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/pos": "Point of Sale",
  "/sales": "Transaction",
  "/inventory": "Inventory",
  "/low-stock": "Low Stock Alert",
  "/suppliers": "Suppliers",
  "/users": "Users",
  "/settings": "Settings",
};

function Header({ toggleSidebar }) {
  const { username, firstName, lastName } = useAuth();
  const location = useLocation();

  const getInitials = () => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (username) return username.slice(0, 2).toUpperCase();
    return "U";
  };

  const displayName = firstName
    ? `${firstName}${lastName ? ` ${lastName}` : ""}`
    : username;

  const isDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  const pageTitle = PAGE_TITLES[location.pathname] || "Page";

  return (
    <header className="bg-white shadow-md py-6 px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <button
          className="flex flex-col justify-between w-10 h-8 p-1 focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 -1 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {username && (
          <span className="font-semibold text-gray-800 text-lg">
            {isDashboard
              ? `Welcome, ${firstName || username}`
              : `You are in ${pageTitle}`}
          </span>
        )}
      </div>

      {/* Right: Username + Avatar */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">
          {displayName}
        </span>

        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials()}
        </div>
      </div>
    </header>
  );
}

export default Header;
