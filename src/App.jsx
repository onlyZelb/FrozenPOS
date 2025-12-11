import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Public Pages
import Login from "./pages/Login/Login.jsx";
import RegisterPage from "./pages/Login/Register.jsx";

// Protected Pages
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import Products from "./pages/Products.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import Users from "./pages/Users.jsx";
import PointOfSale from "./pages/PointOfSale.jsx";
import LowStock from "./pages/LowStock.jsx";
import Transaction from "./pages/Transaction.jsx";

function ProtectedLayout({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales/*" element={<Transaction />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/users" element={<Users />} />
        <Route path="/pos" element={<PointOfSale />} />
        <Route path="/low-stock" element={<LowStock />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
