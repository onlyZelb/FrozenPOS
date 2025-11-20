import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { text: "Home", link: "/", icon: "🏠" },
    { text: "Profile", link: "/profile", icon: "👤" },
    { text: "Settings", link: "/settings", icon: "⚙️" },
    { text: "Logout", link: "/logout", icon: "🚪" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Welcome to FrozenPOS
          </h2>
          <p className="text-gray-700">
            Select an option from the sidebar using the hamburger menu.
          </p>
        </main>
      </div>
    </div>
  );
}

export default App;
