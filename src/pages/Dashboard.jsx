import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";
import {
  AreaChart, 
  Area,      
  XAxis,
  YAxis,
  CartesianGrid,
  // Tooltip is kept in the imports but will not be used in the JSX below
  Tooltip, 
  ResponsiveContainer,
} from "recharts";

// --- CONFIGURATION ---
const LOW_STOCK_THRESHOLD = 10;
const POLLING_INTERVAL = 5000; // Polls every 5 seconds

const Dashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  
  // This state holds the actual number of transaction line items sold
  const [totalTransactions, setTotalTransactions] = useState(0); 
  
  const [salesData, setSalesData] = useState([]);
  
  const [animateTransaction, setAnimateTransaction] = useState(false); 
  const prevTotalTransactionsRef = useRef(0); 

  /**
   * Generates simulated weekly sales data using the actual transaction count
   * as a base for movement and visual scale.
   */
  const generateWeeklySales = (transactionCount) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // Key for movement: Use current time to guarantee a unique offset for each poll
    const timeFactor = new Date().getTime() / 10000; 
    
    // Use the actual transaction count as a base (adjusted for visual scaling)
    // If no transactions, use a default base (e.g., 5000) for visual appeal
    const baseTransactionValue = (transactionCount > 0 ? transactionCount * 10 : 5000);
    const baseTotal = baseTransactionValue + 4000; // Scale up to match the 8000 Y-axis

    return days.map((day, index) => {
      // Create a gentle wave pattern based on index AND time
      const indexFactor = index * 0.5;
      const wave = Math.sin(indexFactor + timeFactor) * 1500; 
      const fluctuation = Math.floor(Math.random() * 800) - 400; 

      const total = baseTotal + wave + fluctuation; 
      return { day, sales: Math.max(2000, Math.round(total)) };
    });
  };

  const fetchProducts = async () => {
    let newTotalTransactions = 0;
    
    // --- 1. Fetch Product Data (for Stock/Inventory metrics) ---
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);

      const newLowStockCount = data.filter((p) => p.stockQuantity < LOW_STOCK_THRESHOLD).length;
      const newTotalStock = data.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);

      setLowStockCount(newLowStockCount);
      setTotalStock(newTotalStock);
      
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
    
    // --- 2. Fetch Processed Sales Data (for Transaction metrics) ---
    try {
        const storedSales = JSON.parse(localStorage.getItem('processedSales')) || [];
        
        // Calculate the total number of items sold across all sales
        const totalItemsSold = storedSales.reduce((sum, sale) => {
            // sale.items is an array of cart items from POS
            const saleItemCount = sale.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
            return sum + saleItemCount;
        }, 0);
        
        newTotalTransactions = totalItemsSold;

    } catch (err) {
        console.error("Error reading transactions from localStorage:", err);
        // Default to 0 if localStorage fails
        newTotalTransactions = 0;
    }


    // --- 3. Update States and Trigger Animation ---
    
    if (newTotalTransactions > prevTotalTransactionsRef.current) {
        setAnimateTransaction(true);
        setTimeout(() => setAnimateTransaction(false), 1000); 
    }
    prevTotalTransactionsRef.current = newTotalTransactions;

    setTotalTransactions(newTotalTransactions); // State updated with actual item count
    
    // Generate sales data using the actual transaction count
    const weeklySales = generateWeeklySales(newTotalTransactions);
    setSalesData(weeklySales);
  };

  useEffect(() => {
    if (!token) return;
    fetchProducts();
    const interval = setInterval(fetchProducts, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [token]);

  const animatedClass = animateTransaction 
    ? "transform scale-105 ring-4 ring-green-500"
    : "";


  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1: Total Stock */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Total Stock</span>
          <span className="text-xl md:text-2xl font-bold">{totalStock.toLocaleString()}</span>
          <span className="text-green-500 text-xs mt-1">
            Updated dynamically
          </span>
        </div>
        
        {/* Card 2: Products in Inventory */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Products in Inventory</span>
          <span className="text-xl md:text-2xl font-bold">
            {products.length}
          </span>
          <span className="text-gray-400 text-xs mt-1">
            {Math.floor((products.length / 300) * 100)}% capacity
          </span>
        </div>
        
        {/* Card 3: Low Stock Items */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm">Low Stock Items</span>
          <span className="text-xl md:text-2xl font-bold">{lowStockCount}</span>
          <span className="text-red-500 text-xs mt-1">Need restocking</span>
        </div>
        
        {/* Card 4: Total Transactions (Now uses actual sold item count) */}
        <div 
            className={`bg-white p-4 rounded-xl shadow flex flex-col justify-between transition-all duration-300 ${animatedClass}`}
        >
          <span className="text-gray-500 text-sm">Total Items Sold</span>
          <span className="text-xl md:text-2xl font-bold">
            {totalTransactions.toLocaleString()}
          </span>
          <span className={`text-xs mt-1 ${animateTransaction ? 'text-blue-600 font-semibold' : 'text-green-500'}`}>
            {animateTransaction ? 'Sale Registered!' : 'From processed sales'}
          </span>
        </div>
      </div>

      {/* Sales Chart (Area Chart) */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          Weekly Sales Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart 
            data={salesData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 8000]} /> 
            {/* ❌ Tooltip component has been removed to disable the hover pop-up */}
            <Area
              type="monotone"
              dataKey="sales" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#colorSales)"
              isAnimationActive={true}
              animationDuration={POLLING_INTERVAL - 500} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;