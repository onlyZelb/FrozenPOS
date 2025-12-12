import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const Sales = () => {
  const { token } = useAuth();
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    paymentMethod: "",
    saleDateTime: "",
    saleType: "",
    totalAmount: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch sales");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchSales();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API_URL}/sales/${editingId}`
        : `${API_URL}/sales`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save sale");

      setForm({
        paymentMethod: "",
        saleDateTime: "",
        saleType: "",
        totalAmount: 0,
      });
      setEditingId(null);
      fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (sale) => {
    setForm({
      paymentMethod: sale.paymentMethod,
      saleDateTime: sale.saleDateTime.replace(" ", "T"),
      saleType: sale.saleType,
      totalAmount: sale.totalAmount,
    });
    setEditingId(sale.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      const res = await fetch(`${API_URL}/sales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete sale");

      fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Sales Management</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 mb-6 bg-white p-4 shadow rounded-lg"
      >
        <input
          name="paymentMethod"
          placeholder="Payment Method"
          value={form.paymentMethod}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
          required
        />

        <input
          name="saleDateTime"
          type="datetime-local"
          value={form.saleDateTime}
          onChange={handleChange}
          className="border p-2 rounded w-56"
          required
        />

        <input
          name="saleType"
          placeholder="Sale Type (Retail/Wholesale)"
          value={form.saleType}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
        />

        <input
          name="totalAmount"
          type="number"
          step="0.01"
          placeholder="Total Amount"
          value={form.totalAmount}
          onChange={handleChange}
          className="border p-2 rounded w-32 text-right"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Sale" : "Add Sale"}
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Payment Method</th>
              <th className="py-2 px-4 text-left">Sale Date</th>
              <th className="py-2 px-4 text-left">Sale Type</th>
              <th className="py-2 px-4 text-right">Total Amount</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No sales found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 text-left">{sale.id}</td>
                  <td className="py-2 px-4 text-left">{sale.paymentMethod}</td>
                  <td className="py-2 px-4 text-left">{sale.saleDateTime}</td>
                  <td className="py-2 px-4 text-left">{sale.saleType}</td>
                  <td className="py-2 px-4 text-right">
                    {sale.totalAmount?.toFixed(2)}
                  </td>

                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
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

export default Sales;
