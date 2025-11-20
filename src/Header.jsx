import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header
      style={{
        background: "#eee",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1>FrozenPOS Beta</h1>
      <button
        onClick={toggleSidebar}
        style={{
          padding: "6px 12px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Toggle Sidebar
      </button>
    </header>
  );
};

export default Header;
