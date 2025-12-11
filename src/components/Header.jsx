import React from "react";
import { useAuth } from "../context/AuthContext";

function Header({ toggleSidebar }) {
  const { username, firstName, lastName } = useAuth();

  // Generate initials
  const getInitials = () => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (username) return username.slice(0, 2).toUpperCase();
    return "U";
  };

  return (
    <header className="bg-white shadow-md py-6 relative flex items-center px-6 justify-between">
      {/* Left: Sidebar toggle + welcome text */}
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
            Welcome, {firstName || username}
          </span>
        )}
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center space-x-4">
        <button className="relative">
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile icon with initials */}
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials()}
        </div>
      </div>
    </header>
  );
}

export default Header;
