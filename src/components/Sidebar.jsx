import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { text: "Home", link: "/", icon: "🏠" },
    { text: "Dashboard", link: "/Dashboard", icon: "📊" },
    { text: "Profile", link: "/profile", icon: "👤" },
    { text: "Settings", link: "/settings", icon: "⚙️" },
    { text: "Logout", link: "/logout", icon: "🚪" },

  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-7 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">FrozenPOS</h2>
      </div>

      <nav className="p-5 space-y-3">
        {menuItems.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className={`flex items-center space-x-4 text-gray-300 rounded-lg px-4 py-3 transition-all ${location.pathname === item.link ? "bg-gray-800 border-l-4 border-blue-600" : "hover:bg-gray-800"}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.text}</span>
          </a>
        ))}
      </nav>  
    </aside>
  );
}

export default Sidebar;
