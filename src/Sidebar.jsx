import React from "react";

const Sidebar = ({ menuItems, isOpen }) => {
  if (!isOpen) return null;

  return (
    <aside
      style={{
        width: "200px",
        background: "#333",
        color: "#fff",
        padding: "10px",
        minHeight: "100vh",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item, index) => (
          <li key={index} style={{ margin: "8px 0" }}>
            <a
              href={item.link}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              {item.icon} {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
