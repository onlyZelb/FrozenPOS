import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const LowStock = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      // Only keep low-stock products (stockQuantity < 10)
      const lowStock = data.filter((p) => p.stockQuantity && p.stockQuantity < 10);
      setProducts(lowStock);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const renderStockStatus = (quantity) => {
    const stock = quantity || 0;
    if (stock === 0) return <span className="text-red-600 font-bold">OUT OF STOCK</span>;
    return <span className="text-yellow-500 font-semibold">LOW STOCK ({stock})</span>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Low Stock Products</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {products.length === 0 ? (
        <p>All products are sufficiently stocked.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Product Name</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Points</th>
                <th className="py-2 px-4 text-right">Base Price</th>
                <th className="py-2 px-4 text-right">List Price</th>
                <th className="py-2 px-4 text-right">Stock Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 text-left">{product.id}</td>
                  <td className="py-2 px-4 text-left">{product.productName}</td>
                  <td className="py-2 px-4 text-left">{product.description}</td>
                  <td className="py-2 px-4 text-right">{product.productPoint || 0}</td>
                  <td className="py-2 px-4 text-right">{(product.wholeSale || 0).toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{(product.retailPrice || 0).toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{renderStockStatus(product.stockQuantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LowStock;
