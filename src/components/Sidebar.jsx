import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoGrid, IoReceipt, IoSettings, IoLogOut, IoWarning } from "react-icons/io5";
import { FaBoxesStacked, FaCartShopping, FaHandshake, FaArrowRightArrowLeft, FaUsers } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";
import axios from "axios";

const SIDEBAR_BG_COLOR = "bg-[#2E3758]";
const ACTIVE_BG_COLOR = "bg-blue-600";
const ACTIVE_BORDER_COLOR = "border-blue-500";
const ALERT_COLOR = "bg-red-500";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [lowStockCount, setLowStockCount] = useState(0);

  // --- Fetch products and calculate low stock count ---
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:9090/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Count products with stock < 10
        const lowStockProducts = response.data.filter(
          p => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) < 10
        );
        setLowStockCount(lowStockProducts.length);
      } catch (err) {
        console.error("Failed to fetch products for low stock:", err);
      }
    };

    fetchLowStock();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", link: "/", icon: <IoGrid className="text-xl" /> },
    { text: "Point of Sale", link: "/pos", icon: <FaCartShopping className="text-xl" /> },
    { text: "Transaction", link: "/sales", icon: <FaArrowRightArrowLeft className="text-xl" /> },
    { text: "Inventory", link: "/inventory", icon: <FaBoxesStacked className="text-xl" /> },
    { text: "Low Stock Alert", link: "/low-stock", icon: <IoWarning className="text-xl" />, alert: lowStockCount, alertColor: ALERT_COLOR },
    { text: "Suppliers", link: "/suppliers", icon: <FaHandshake className="text-xl" /> },
    { text: "Settings", link: "/settings", icon: <IoSettings className="text-xl" /> },
  ];

  if (role === "admin") {
    // insert "Users" before Suppliers (index 5 in current array)
    menuItems.splice(5, 0, { text: "Users", link: "/users", icon: <FaUsers className="text-xl" /> });
  }

  // consider nested route active (e.g. /sales/123)
  const isActive = path =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 ${SIDEBAR_BG_COLOR} shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700/50">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="text-2xl mr-2">🧊</span>FrozenPOS
        </h2>
      </div>

      {/* Navigation - NO SCROLLBAR */}
      <nav className="flex-grow py-5 space-y-2 px-4 overflow-hidden">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`flex items-center justify-between text-gray-300 rounded-lg px-4 py-3 transition-all ${
              isActive(item.link)
                ? `${ACTIVE_BG_COLOR} border-l-4 ${ACTIVE_BORDER_COLOR} font-semibold text-white`
                : "hover:bg-gray-700/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-medium">{item.text}</span>
            </div>

            {item.alert > 0 && (
              <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${item.alertColor}`}>
                {item.alert}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full space-x-3 text-gray-300 rounded-lg px-4 py-3 mb-4 transition-all hover:bg-gray-700/50"
        >
          <IoLogOut className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="text-xs text-gray-400">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm">🧊</span>
            <span>FrozenPOS</span>
          </div>
          <p className="ml-6">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
