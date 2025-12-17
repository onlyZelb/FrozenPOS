import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const LOW_STOCK_THRESHOLD = 10;

const Dashboard = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [salesData, setSalesData] = useState([
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 0 },
    { day: "Wed", sales: 0 },
    { day: "Thu", sales: 0 },
    { day: "Fri", sales: 0 },
    { day: "Sat", sales: 0 },
    { day: "Sun", sales: 0 },
  ]);
  const [totalTransactions, setTotalTransactions] = useState(0);


  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);


      setLowStockCount(
        data.filter(
          (p) =>
            p.stockQuantity > 0 &&
            p.stockQuantity < LOW_STOCK_THRESHOLD
        ).length
      );


      setOutOfStockCount(
        data.filter(
          (p) => !p.stockQuantity || p.stockQuantity === 0
        ).length
      );

      setTotalStock(
        data.reduce((acc, p) => acc + (p.stockQuantity || 0), 0)
      );
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };


  const updateSalesData = () => {
    const storedSales =
      JSON.parse(localStorage.getItem("processedSales")) || [];

    let newData = [...salesData];
    let totalItemsSold = 0;

    storedSales.forEach((sale) => {
      const date = new Date(sale.date || Date.now());
      const dayIndex = date.getDay();
      const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = dayMap[dayIndex];

      const itemsSold = sale.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      totalItemsSold += itemsSold;

      newData = newData.map((d) =>
        d.day === dayName
          ? {
              ...d,
              sales: Math.max(d.sales, d.sales + itemsSold * 10),
            }
          : d
      );
    });

    setSalesData(newData);
    setTotalTransactions(totalItemsSold);
  };


  useEffect(() => {
    if (!token) return;
    fetchProducts();
    updateSalesData();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "processedSales") {
        updateSalesData();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () =>
      window.removeEventListener("storage", handleStorage);
  }, [salesData]);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Dashboard
      </h2>

      {/* ---------- Summary Cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Stock</span>
          <span className="text-xl md:text-2xl font-bold">
            {totalStock.toLocaleString()}
          </span>
          <span className="text-green-600 text-sm mt-1">Total items in stock</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Products</span>
          <span className="text-xl md:text-2xl font-bold">{products.length}</span>
          <span className="text-blue-600 text-sm mt-1">Products in Inventory</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Low Stock Items</span>
          <span className="text-xl md:text-2xl font-bold">{lowStockCount}</span>
          <span
            className={`text-yellow-600 text-sm mt-1 ${
              lowStockCount === 0 ? "invisible" : "visible"
            }`}
          >
            Action required
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Out of Stock Items</span>
          <span className="text-xl md:text-2xl font-bold">{outOfStockCount}</span>
          <span
            className={`text-red-600 text-sm mt-1 ${
              outOfStockCount === 0 ? "invisible" : "visible"
            }`}
          >
            Immediate restock required
          </span>
        </div>
      </div>

      {/* ---------- Bar Chart ---------- */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          Weekly Sales Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={salesData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 8000]} />
            <Bar
              dataKey="sales"
              fill="#3b82f6"
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
