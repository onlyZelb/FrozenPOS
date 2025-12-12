import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const Suppliers = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ supplierName: "", email: "", phoneNumber: "", productIds: [] });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- Fetch suppliers ---
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_URL}/suppliers`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Fetch products ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchSuppliers(), fetchProducts()]).finally(() => setLoading(false));
    }
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Form handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleProduct = (productId) => {
    setForm(prev => {
      const exists = prev.productIds.includes(productId);
      return {
        ...prev,
        productIds: exists ? prev.productIds.filter(id => id !== productId) : [...prev.productIds, productId]
      };
    });
  };

  const resetForm = () => {
    setForm({ supplierName: "", email: "", phoneNumber: "", productIds: [] });
    setEditingId(null);
    setDropdownOpen(false);
  };

  // --- Add / Update supplier ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierName.trim() || !form.email.trim()) {
      setError("Supplier Name and Email are required.");
      return;
    }
    setError("");
    try {
      const url = editingId ? `${API_URL}/suppliers/${editingId}` : `${API_URL}/suppliers`;
      const method = editingId ? "PUT" : "POST";
      const payload = { ...form };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save supplier");

      await Promise.all([fetchSuppliers(), fetchProducts()]);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (supplier) => {
    const assignedProducts = supplier.products ? supplier.products.map(p => p.id) : [];
    setForm({
      supplierName: supplier.supplierName,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      productIds: assignedProducts
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete supplier");
      await fetchSuppliers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Suppliers & Products</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {loading && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">Loading...</div>}

      {/* Supplier Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg mb-6 grid grid-cols-12 gap-4 items-end relative">
        <input
          name="supplierName"
          placeholder="Supplier Name"
          value={form.supplierName}
          onChange={handleChange}
          className="col-span-12 md:col-span-3 border p-2 rounded"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="col-span-12 md:col-span-3 border p-2 rounded"
          required
        />
        <input
          name="phoneNumber"
          placeholder="Phone"
          value={form.phoneNumber}
          onChange={handleChange}
          className="col-span-12 md:col-span-3 border p-2 rounded"
        />

        {/* Product dropdown */}
        <div className="col-span-12 md:col-span-3 relative" ref={dropdownRef}>
          <button
            type="button"
            className="w-full border p-2 rounded text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Assign Products ({form.productIds.length})
          </button>
          {dropdownOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto border bg-white rounded shadow">
              {products.map(p => (
                <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.productIds.includes(p.id)}
                    onChange={() => handleToggleProduct(p.id)}
                  />
                  <span>{p.productName} (Stock: {p.stockQuantity || 0})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-12 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? "Update Supplier" : "Add Supplier"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Suppliers Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Supplier Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Products Assigned</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No suppliers found.</td>
              </tr>
            ) : (
              suppliers.map(supplier => (
                <tr key={supplier.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{supplier.supplierName}</td>
                  <td className="py-2 px-4">{supplier.email}</td>
                  <td className="py-2 px-4">{supplier.phoneNumber}</td>
                  <td className="py-2 px-4">
                    {supplier.products && supplier.products.length > 0
                      ? supplier.products.map(p => (
                          <div key={p.id} className="flex justify-between text-sm border-b border-gray-100 py-1">
                            <span>{p.productName}</span>
                            <span className="ml-2 font-bold">{p.stockQuantity || 0}</span>
                          </div>
                        ))
                      : <span className="text-gray-400 italic">No products assigned</span>
                    }
                  </td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button onClick={() => handleEdit(supplier)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(supplier.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;
