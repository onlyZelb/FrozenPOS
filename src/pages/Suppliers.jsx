import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const Suppliers = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    supplierName: "",
    email: "",
    phoneNumber: "", // Maps to phone_number
    contactPerson: "", // New field added based on standard design
    address: "",       // New field added based on standard design
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- API Functions ---

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      const data = await res.json();
      
      // Map API response fields to consistent camelCase keys for the frontend
      const mappedData = data.map(item => ({
        id: item.supplier_id || item.id,
        supplierName: item.supplier_name,
        email: item.email,
        phoneNumber: item.phone_number,
        contactPerson: item.contact_person || 'N/A', // Assuming backend will add this
        address: item.address || 'N/A',             // Assuming backend will add this
        lastContact: item.last_contact || new Date().toLocaleDateString(), // Placeholder
      }));

      setSuppliers(mappedData);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSuppliers();
  }, [token]);

  // --- Form and CRUD Logic (Simplified for readability) ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setForm({ supplierName: "", email: "", phoneNumber: "", contactPerson: "", address: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!form.supplierName.trim() || !form.email.trim()) {
      setError("Supplier Name and Email are required.");
      setLoading(false);
      return;
    }

    try {
      const url = editingId ? `${API_URL}/suppliers/${editingId}` : `${API_URL}/suppliers`;
      const method = editingId ? "PUT" : "POST";

      const payload = {
        supplier_name: form.supplierName,
        email: form.email,
        phone_number: form.phoneNumber,
        contact_person: form.contactPerson,
        address: form.address,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to ${editingId ? "update" : "add"} supplier`);
      
      handleClearForm();
      fetchSuppliers();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      supplierName: supplier.supplierName,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      contactPerson: supplier.contactPerson,
      address: supplier.address,
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    if (loading) return; 
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete supplier");
      fetchSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Component Render ---

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Supplier Management</h2>

      {error && <p className="text-red-600 mb-4 font-medium p-3 bg-red-100 border border-red-400 rounded">{error}</p>}
      {loading && <p className="text-blue-600 mb-4 font-medium p-3 bg-blue-100 border border-blue-400 rounded">Loading...</p>}

      {/* Supplier Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6 bg-white p-4 shadow rounded-lg items-center">
        <input
          name="supplierName"
          placeholder="Supplier Name"
          value={form.supplierName}
          onChange={handleChange}
          className="border p-2 rounded flex-1 min-w-[120px]"
          required
        />
        <input
          name="contactPerson"
          placeholder="Contact Person (Optional)"
          value={form.contactPerson}
          onChange={handleChange}
          className="border p-2 rounded flex-1 min-w-[120px]"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded flex-1 min-w-[120px]"
          required
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {editingId ? "Update" : "Add"} Supplier
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Supplier Name</th>
              <th className="py-2 px-4 text-left">Contact Person</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-center">Products</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && !loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 text-left">{supplier.id}</td>
                  <td className="py-2 px-4 text-left font-semibold">{supplier.supplierName}</td>
                  <td className="py-2 px-4 text-left">{supplier.contactPerson}</td>
                  <td className="py-2 px-4 text-left">
                    <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">{supplier.email}</a>
                  </td>
                  <td className="py-2 px-4 text-left">{supplier.phoneNumber}</td>
                  <td className="py-2 px-4 text-center">
                    {/* Placeholder for future product linkage */}
                    <span className="text-gray-500">N/A</span>
                  </td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      disabled={loading}
                    >
                      Delete
                    </button>
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