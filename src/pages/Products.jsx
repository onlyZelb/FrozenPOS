import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/constant";

const Products = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    description: "",
    productPoint: 0,
    retailPrice: 0,
    wholeSale: 0,
    stockQuantity: 0,
    imagePath: "", 
  });
  const [selectedImage, setSelectedImage] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const isNumericField = [
      "productPoint",
      "retailPrice",
      "wholeSale",
      "stockQuantity",
    ].includes(name);

    let finalValue = value;

    if (isNumericField) {
      finalValue = value === "" ? 0 : parseFloat(value);
      if (isNaN(finalValue) && value !== "") {
          return; 
      }
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e) => {
      
      setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const formData = new FormData();
    
    
    formData.append("productName", form.productName);
    formData.append("description", form.description);
    formData.append("productPoint", form.productPoint);
    formData.append("retailPrice", form.retailPrice);
    formData.append("wholeSale", form.wholeSale);
    formData.append("stockQuantity", form.stockQuantity);
    
    
    if (selectedImage) {
        formData.append("file", selectedImage); 
    } else if (form.imagePath) {
        
        formData.append("imagePath", form.imagePath);
    }

    try {
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? "PUT" : "POST";


      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formData, 
      });

      if (!res.ok) throw new Error("Failed to save product");

      
      setForm({ productName: "", description: "", productPoint: 0, retailPrice: 0, wholeSale: 0, stockQuantity: 0, imagePath: "" });
      setSelectedImage(null);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.productName,
      description: product.description,
      productPoint: product.productPoint || 0,
      retailPrice: product.retailPrice || 0,
      wholeSale: product.wholeSale || 0,
      stockQuantity: product.stockQuantity || 0,
      imagePath: product.imagePath || "", 
    });
    
    setSelectedImage(null); 
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Frozen Meats Catalog</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6 bg-white p-4 shadow rounded-lg">
        <input
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
        />
        <input
          name="productPoint"
          type="number"
          placeholder="Points"
          value={form.productPoint}
          onChange={handleChange}
          className="border p-2 rounded w-24 text-right"
        />
        <input
          name="retailPrice"
          type="number"
          step="0.01"
          placeholder="Retail Price"
          value={form.retailPrice}
          onChange={handleChange}
          className="border p-2 rounded w-32 text-right"
        />
        <input
          name="wholeSale"
          type="number"
          step="0.01"
          placeholder="Wholesale Price"
          value={form.wholeSale}
          onChange={handleChange}
          className="border p-2 rounded w-32 text-right"
        />
        <input
          name="stockQuantity"
          type="number"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
          className="border p-2 rounded w-24 text-right"
        />
        {/* NEW IMAGE UPLOAD INPUT */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="file"
            name="image"
            onChange={handleImageChange} 
            className="border p-1.5 rounded w-full text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* Display current image path or preview if editing */}
          {editingId && form.imagePath && (
            <p className="text-xs text-gray-500 mt-1">
              Current: {form.imagePath.split('/').pop()}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update" : "Add"} Product
        </button>
      </form>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Product Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Points</th>
              <th className="py-2 px-4 text-right">Retail Price</th>
              <th className="py-2 px-4 text-right">Wholesale Price</th>
              <th className="py-2 px-4 text-right">Stock Quantity</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 text-left">{product.id}</td>
                  <td className="py-2 px-4 text-left">{product.productName}</td>
                  <td className="py-2 px-4 text-left">{product.description}</td>
                  <td className="py-2 px-4 text-right">{product.productPoint || 0}</td>
                  <td className="py-2 px-4 text-right">{(product.retailPrice || 0).toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{(product.wholeSale || 0).toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{product.stockQuantity || 0}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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

export default Products;