import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [salesData, setSalesData] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);

      // Metrics calculations
      setLowStockCount(data.filter((p) => p.stockQuantity < 10).length);
      setTotalStock(data.reduce((acc, p) => acc + p.stockQuantity, 0));
      setTotalTransactions(
        data.reduce((acc, p) => acc + (p.productPoint || 0), 0)
      );

      const weeklySales = generateWeeklySales(data);
      setSalesData(weeklySales);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const generateWeeklySales = (products) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => {
      const total = products
        .filter(() => Math.floor(Math.random() * 7) === days.indexOf(day))
        .reduce((acc, p) => acc + (p.productPoint || 0), 0);
      return { day, sales: total };
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Total Stock</span>
          <span className="text-xl md:text-2xl font-bold">{totalStock}</span>
          <span className="text-green-500 text-xs mt-1">
            Updated dynamically
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Products in Inventory</span>
          <span className="text-xl md:text-2xl font-bold">
            {products.length}
          </span>
          <span className="text-gray-400 text-xs mt-1">
            {Math.floor((products.length / 300) * 100)}% capacity
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Low Stock Items</span>
          <span className="text-xl md:text-2xl font-bold">{lowStockCount}</span>
          <span className="text-red-500 text-xs mt-1">Need restocking</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Total Transactions</span>
          <span className="text-xl md:text-2xl font-bold">
            {totalTransactions}
          </span>
          <span className="text-green-500 text-xs mt-1">
            Updated dynamically
          </span>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          Weekly Sales Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="#bfdbfe"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
