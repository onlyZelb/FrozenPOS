import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const Inventory = ({ onProductsUpdate }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    description: "",
    basePrice: 0,
    listPrice: 0,
    stockQuantity: 0,
    imagePath: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stockEditingProduct, setStockEditingProduct] = useState(null);
  const formRef = useRef(null);

  // --- Fetch Products ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || res.statusText);
      let data = await res.json();

      const archivedData = JSON.parse(localStorage.getItem("archivedProducts") || "{}");
      data = data.map((p) => ({ ...p, archived: archivedData[p.id] || false }));

      setProducts(data);
      setFilteredProducts(data);
      if (onProductsUpdate) onProductsUpdate(data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  // --- Search / Filter ---
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
      return showArchived ? p.archived && matchesSearch : !p.archived && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products, showArchived]);

  const resetForm = () => {
    setForm({ productName: "", description: "", basePrice: 0, listPrice: 0, stockQuantity: 0, imagePath: "" });
    setSelectedImage(null);
    setEditingId(null);
    setStockEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["basePrice", "listPrice", "stockQuantity"];
    let finalValue = numericFields.includes(name) ? (value === "" ? 0 : parseFloat(value)) : value;
    if (isNaN(finalValue) && numericFields.includes(name)) return;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e) => setSelectedImage(e.target.files[0]);

  // --- Add or Update Product ---
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
    formData.append("wholeSale", form.basePrice);
    formData.append("retailPrice", form.listPrice);
    formData.append("stockQuantity", form.stockQuantity);
    if (selectedImage) formData.append("file", selectedImage);

    try {
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.text() || res.statusText);

      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.productName,
      description: product.description,
      basePrice: product.wholeSale || 0,
      listPrice: product.retailPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      imagePath: product.imagePath || "",
    });
    setSelectedImage(null);
    setEditingId(product.id);
    setStockEditingProduct(null);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStockClick = (product) => {
    setForm({
      productName: product.productName,
      description: product.description,
      basePrice: product.wholeSale || 0,
      listPrice: product.retailPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      imagePath: product.imagePath || "",
    });
    setSelectedImage(null);
    setEditingId(product.id);
    setStockEditingProduct(product);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Archive / Return Product ---
  const toggleArchive = (productId, archived) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, archived: !archived } : p))
    );
    const archivedData = JSON.parse(localStorage.getItem("archivedProducts") || "{}");
    archivedData[productId] = !archived;
    localStorage.setItem("archivedProducts", JSON.stringify(archivedData));
  };

  // --- Low Stock Display ---
  const renderStockStatus = (quantity) => {
    if (!quantity)
      return <span className="text-red-600 font-bold">OUT OF STOCK</span>;
    if (quantity < 10)
      return (
        <span className="flex items-center justify-end gap-2">
          <span className="text-orange-500 font-semibold">LOW STOCK</span>
          <span className="inline-flex items-center justify-center bg-yellow-400 text-white rounded-full w-5 h-5 text-xs font-bold">
            {quantity}
          </span>
        </span>
      );
    return <span className="text-right">{quantity}</span>;
  };

  const getFormTitle = () => stockEditingProduct
    ? `Quick Stock Update for: ${stockEditingProduct.productName}`
    : editingId
    ? `Editing Product: ${form.productName}`
    : "Add New Product";

  const isStockDisabled = editingId && !stockEditingProduct;
  const isStockReadOnly = !editingId;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Product & Inventory Management</h2>

      {successMessage && <div className="bg-green-500 text-white p-3 rounded mb-4 shadow text-center">{successMessage}</div>}
      {error && <div className="bg-red-500 text-white p-3 rounded mb-4 shadow text-center">{error}</div>}

      <div className="mb-4 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-3 py-1 rounded ${showArchived ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
      </div>

      {/* --- Form Section with Header --- */}
      <div className="bg-white shadow rounded-lg mb-6" ref={formRef}>
        <div className="p-3 bg-gray-200 text-gray-700 rounded-t-lg border-b border-gray-300">
          <h3 className="text-lg font-semibold">{getFormTitle()}</h3>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-12 text-sm font-semibold bg-gray-100 text-gray-700 p-2 border-b border-gray-300">
          <div className="col-span-12 md:col-span-3 text-center">Product Name</div>
          <div className="col-span-12 md:col-span-3 text-center">Description</div>
          <div className="col-span-6 md:col-span-2 text-center">Base Price</div>
          <div className="col-span-6 md:col-span-2 text-center">List Price</div>
          <div className="col-span-6 md:col-span-2 text-center">Stock</div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3 p-4 items-end">
          <div className="col-span-12 md:col-span-3">
            <input
              id="productName"
              name="productName"
              placeholder="Enter product name"
              value={form.productName}
              onChange={handleChange}
              disabled={!!stockEditingProduct}
              className={`border p-2 rounded w-full ${stockEditingProduct ? "bg-gray-100 text-gray-500" : "focus:ring-blue-400 focus:border-blue-400"}`}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <input
              id="description"
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              disabled={!!stockEditingProduct}
              className={`border p-2 rounded w-full ${stockEditingProduct ? "bg-gray-100 text-gray-500" : "focus:ring-blue-400 focus:border-blue-400"}`}
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <input
              id="basePrice"
              name="basePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.basePrice}
              onChange={handleChange}
              disabled={!!stockEditingProduct}
              className={`border p-2 rounded w-full text-right ${stockEditingProduct ? "bg-gray-100 text-gray-500" : "focus:ring-blue-400 focus:border-blue-400"}`}
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <input
              id="listPrice"
              name="listPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.listPrice}
              onChange={handleChange}
              disabled={!!stockEditingProduct}
              className={`border p-2 rounded w-full text-right ${stockEditingProduct ? "bg-gray-100 text-gray-500" : "focus:ring-blue-400 focus:border-blue-400"}`}
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              placeholder="0"
              value={form.stockQuantity}
              onChange={handleChange}
              disabled={isStockDisabled}
              readOnly={isStockReadOnly && !stockEditingProduct}
              className={`border p-2 rounded w-full text-right
                ${(isStockDisabled || isStockReadOnly) && !stockEditingProduct
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : stockEditingProduct
                  ? "focus:ring-green-500 focus:border-green-500 border-green-400 text-lg font-bold"
                  : "focus:ring-blue-400 focus:border-blue-400"
                }`}
              autoFocus={!!stockEditingProduct}
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-12 md:col-span-4 mt-3">
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1 text-center">Product Image</label>
            <input
              id="imageFile"
              type="file"
              name="image"
              onChange={handleImageChange}
              disabled={!!stockEditingProduct}
              className={`border p-2 rounded w-full text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${stockEditingProduct ? "bg-gray-100 text-gray-500" : ""}`}
            />
            {editingId && form.imagePath && (
              <p className="text-xs text-gray-500 mt-1">Current: {form.imagePath.split("/").pop()}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-12 md:col-span-3 flex items-end gap-2">
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex-grow">Cancel</button>
            )}
            <button type="submit" className={`px-4 py-2 rounded w-full ${stockEditingProduct ? "bg-green-600 hover:bg-green-700 text-white flex-grow-2" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
              {stockEditingProduct ? "Confirm Stock Update" : editingId ? "Update Product Details" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Product Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Base Price</th>
              <th className="py-2 px-4 text-right">List Price</th>
              <th className="py-2 px-4 text-right">Stock</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={`${product.id}-${index}`} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{product.id}</td>
                  <td className="py-2 px-4">{product.productName}</td>
                  <td className="py-2 px-4">{product.description}</td>
                  <td className="py-2 px-4 text-right">{(product.wholeSale || 0).toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{(product.retailPrice || 0).toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{renderStockStatus(product.stockQuantity)}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleStockClick(product)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm">Add stock</button>
                    <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm">Edit Details</button>
                    <button onClick={() => toggleArchive(product.id, product.archived)}
                      className={`px-3 py-1 rounded text-sm ${product.archived ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-500 text-white hover:bg-gray-600"}`}
                    >
                      {product.archived ? "Return" : "Archive"}
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

export default Inventory;
