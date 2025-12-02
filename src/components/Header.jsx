import React from "react";

function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-md py-6 relative flex items-center px-6 justify-between">

      <div className="flex items-center space-x-4">
        <button
          className="flex flex-col justify-between w-10 h-8 p-1 focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 -1 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>


      </div>

      <div className="absolute right-1 transform -translate-x-1/2">
        <input
          type="text"
          placeholder="Search..."
          className="w-68 px-3 pl-10 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
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
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
          BZ
        </div>
      </div>
    </header>
  );
}

export default Header;
