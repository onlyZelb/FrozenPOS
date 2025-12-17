import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const LOW_STOCK_THRESHOLD = 10;

const Suppliers = () => {
  const { token } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    supplierName: "",
    email: "",
    phoneNumber: "",
    productIds: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({
    supplierName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showArchived, setShowArchived] = useState(false);

  const dropdownRef = useRef(null);

  // ---------- Fetch Suppliers & Products ----------
  const fetchSuppliers = async () => {
    const res = await fetch(`${API_URL}/suppliers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch suppliers");
    const data = await res.json();

    const archivedData = JSON.parse(localStorage.getItem("archivedSuppliers") || "{}");
    const updatedData = data.map(s => ({ ...s, archived: archivedData[s.id] || false }));

    setSuppliers(updatedData);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    setProducts(await res.json());
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([fetchSuppliers(), fetchProducts()])
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleToggleProduct = (id) => {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter(pid => pid !== id)
        : [...prev.productIds, id],
    }));
  };

  const resetForm = () => {
    setForm({ supplierName: "", email: "", phoneNumber: "", productIds: [] });
    setErrors({ supplierName: "", email: "" });
    setEditingId(null);
    setDropdownOpen(false);
  };

  
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { supplierName: "", email: "" };
    if (!form.supplierName.trim()) newErrors.supplierName = "Invalid Name";
    if (!form.email.trim() || !isValidEmail(form.email))
      newErrors.email = "Invalid Email";

    setErrors(newErrors);
    return !newErrors.supplierName && !newErrors.email;
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editingId
        ? `${API_URL}/suppliers/${editingId}`
        : `${API_URL}/suppliers`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save supplier");

      await Promise.all([fetchSuppliers(), fetchProducts()]);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      supplierName: supplier.supplierName,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber || "",
      productIds: supplier.products?.map(p => p.id) || [],
    });
    setEditingId(supplier.id);
  };

  
  const toggleArchive = (supplierId, archived) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === supplierId ? { ...s, archived: !archived } : s))
    );
    const archivedData = JSON.parse(localStorage.getItem("archivedSuppliers") || "{}");
    archivedData[supplierId] = !archived;
    localStorage.setItem("archivedSuppliers", JSON.stringify(archivedData));
  };

  
  const displayedSuppliers = suppliers.filter(s => showArchived ? s.archived : !s.archived);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Suppliers & Products</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
      {loading && <div className="bg-blue-100 text-blue-700 p-3 mb-4">Loading...</div>}

      {/* ---------- Show Archived Toggle ---------- */}
      <div className="mb-4 flex justify-end gap-4">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-3 py-1 rounded ${showArchived ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
      </div>

      {/* ---------- Form ---------- */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <input
            name="supplierName"
            placeholder="Supplier Name"
            value={form.supplierName}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.supplierName && "border-red-500"}`}
          />
          {errors.supplierName && (
            <p className="text-red-500 text-sm mt-1">{errors.supplierName}</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-3">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.email && "border-red-500"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-3">
          <input
            name="phoneNumber"
            placeholder="Phone (optional)"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="col-span-12 md:col-span-3 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border p-2 rounded text-left"
          >
            Assign Products ({form.productIds.length})
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto border bg-white rounded shadow">
              {products.map(p => (
                <label key={p.id} className="flex gap-2 p-2 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={form.productIds.includes(p.id)}
                    onChange={() => handleToggleProduct(p.id)}
                  />
                  {p.productName} (Stock: {p.stockQuantity || 0})
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update Supplier" : "Add Supplier"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------- Table ---------- */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Contact</th>
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSuppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No suppliers found.</td>
              </tr>
            ) : (
              displayedSuppliers.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 align-top">{s.supplierName}</td>
                  <td className="p-2 align-top">{s.email}</td>
                  <td className="p-2 align-top">{s.phoneNumber || "-"}</td>

                  <td className="p-2 align-top">
                    {s.products?.length ? (
                      <div className="space-y-1">
                        {s.products.map(p => (
                          <div key={p.id} className="text-sm">{p.productName}</div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No products</span>
                    )}
                  </td>

                  <td className="p-2 align-top">
                    {s.products?.length ? (
                      <div className="space-y-1">
                        {s.products.map(p => (
                          <div
                            key={p.id}
                            className={`text-sm ${p.stockQuantity < LOW_STOCK_THRESHOLD ? "text-red-500 font-bold" : "font-medium"}`}
                          >
                            {p.stockQuantity || 0}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">—</span>
                    )}
                  </td>

                  <td className="p-2 align-top">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleArchive(s.id, s.archived)}
                        className={`px-3 py-1 rounded text-sm ${
                          s.archived ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-500 text-white hover:bg-gray-600"
                        }`}
                      >
                        {s.archived ? "Return" : "Archive"}
                      </button>
                    </div>
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
