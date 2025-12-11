import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const Inventory = ({ onProductsUpdate }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    productName: "",
    description: "",
    productPoint: 0,
    basePrice: 0,
    listPrice: 0,
    stockQuantity: 0,
    imagePath: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    product: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      if (onProductsUpdate) onProductsUpdate(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  useEffect(() => {
    setFilteredProducts(
      searchTerm
        ? products.filter((p) =>
            p.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : products
    );
  }, [searchTerm, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "productPoint",
      "basePrice",
      "listPrice",
      "stockQuantity",
    ];
    let finalValue = numericFields.includes(name)
      ? value === ""
        ? 0
        : parseFloat(value)
      : value;
    if (isNaN(finalValue) && numericFields.includes(name)) return;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e) => setSelectedImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.description.trim()) {
      setError("Please provide product name and description.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("description", form.description);
    formData.append("productPoint", form.productPoint);
    formData.append("wholeSale", form.basePrice);
    formData.append("retailPrice", form.listPrice);
    formData.append("stockQuantity", form.stockQuantity);
    if (selectedImage) formData.append("file", selectedImage);

    try {
      const url = editingId
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to save product");

      const updatedProduct = await res.json();

      // Update products state without full reload
      setProducts((prev) => {
        if (editingId) {
          return prev.map((p) => (p.id === editingId ? updatedProduct : p));
        }
        return [...prev, updatedProduct];
      });
      setFilteredProducts((prev) => [...prev, updatedProduct]);

      setSuccessMessage(
        `${editingId ? "Updated" : "Added"} ${form.productName} successfully`
      );
      setForm({
        productName: "",
        description: "",
        productPoint: 0,
        basePrice: 0,
        listPrice: 0,
        stockQuantity: 0,
        imagePath: "",
      });
      setSelectedImage(null);
      setEditingId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.productName,
      description: product.description,
      productPoint: product.productPoint || 0,
      basePrice: product.wholeSale || 0,
      listPrice: product.retailPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      imagePath: product.imagePath || "",
    });
    setSelectedImage(null);
    setEditingId(product.id);
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    try {
      const res = await fetch(`${API_URL}/products/${deleteModal.product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteModal.product.id)
      );
      setFilteredProducts((prev) =>
        prev.filter((p) => p.id !== deleteModal.product.id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteModal({ visible: false, product: null });
    }
  };

  const renderStockStatus = (quantity) => {
    if (!quantity)
      return <span className="text-red-600 font-bold">OUT OF STOCK</span>;
    if (quantity < 10)
      return (
        <span className="text-orange-500 font-semibold">
          LOW STOCK ({quantity})
        </span>
      );
    return <span>{quantity}</span>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">
        Product & Inventory Management
      </h2>

      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded mb-4 shadow text-center">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4 shadow text-center">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-3 mb-6 bg-white p-4 shadow rounded-lg items-end"
      >
        <div className="col-span-12 md:col-span-3">
          <input
            name="productName"
            placeholder="Product Name"
            value={form.productName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="col-span-6 md:col-span-1">
          <input
            name="productPoint"
            type="number"
            placeholder="Points"
            value={form.productPoint}
            onChange={handleChange}
            className="border p-2 rounded w-full text-right"
          />
        </div>
        <div className="col-span-6 md:col-span-1">
          <input
            name="basePrice"
            type="number"
            step="0.01"
            placeholder="Base Price"
            value={form.basePrice}
            onChange={handleChange}
            className="border p-2 rounded w-full text-right"
          />
        </div>
        <div className="col-span-6 md:col-span-1">
          <input
            name="listPrice"
            type="number"
            step="0.01"
            placeholder="List Price"
            value={form.listPrice}
            onChange={handleChange}
            className="border p-2 rounded w-full text-right"
          />
        </div>
        <div className="col-span-6 md:col-span-1">
          <input
            name="stockQuantity"
            type="number"
            placeholder="Stock"
            value={form.stockQuantity}
            onChange={handleChange}
            className="border p-2 rounded w-full text-right"
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="border p-2 rounded w-full text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {editingId && form.imagePath && (
            <p className="text-xs text-gray-500 mt-1">
              Current: {form.imagePath.split("/").pop()}
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {editingId ? "Update" : "Add"} Product
          </button>
        </div>
      </form>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Product Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Points</th>
              <th className="py-2 px-4 text-right">Base Price</th>
              <th className="py-2 px-4 text-right">List Price</th>
              <th className="py-2 px-4 text-right">Stock</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{product.id}</td>
                  <td className="py-2 px-4">{product.productName}</td>
                  <td className="py-2 px-4">{product.description}</td>
                  <td className="py-2 px-4 text-right">
                    {product.productPoint || 0}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {(product.wholeSale || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {(product.retailPrice || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {renderStockStatus(product.stockQuantity)}
                  </td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ visible: true, product })}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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

      {/* Delete Modal */}
      {deleteModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteModal.product.productName}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() =>
                  setDeleteModal({ visible: false, product: null })
                }
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
