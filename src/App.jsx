import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100 overflow-hidden">
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                  isSidebarOpen ? "ml-64" : "ml-0"
                }`}
              >
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6 overflow-auto">
                  <Dashboard />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />


      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
