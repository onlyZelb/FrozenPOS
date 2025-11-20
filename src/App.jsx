import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { text: "Home", link: "/", icon: "🏠" },
    { text: "Profile", link: "/profile", icon: "👤" },
    { text: "Settings", link: "/settings", icon: "⚙️" },
    { text: "Logout", link: "/logout", icon: "🚪" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={menuItems} isOpen={isSidebarOpen} />
      <div style={{ flex: 1 }}>
        <Header toggleSidebar={toggleSidebar} />
        <main style={{ padding: "20px" }}>
          <h2>Welcome to FrozenPOS</h2>
          <p>Please select your Food...</p>
        </main>
      </div>
    </div>
  );
}

export default App;
