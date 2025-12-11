import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:9090/api';

// --- Product Card ---
const ProductCard = ({ product, addToCart }) => {
    const stock = product.stockQuantity ?? 0;
    const isOutOfStock = stock === 0;

    return (
        <div
            className={`
                bg-white p-4 rounded-lg shadow-md transition flex flex-col relative
                ${isOutOfStock ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}
            `}
            onClick={() => !isOutOfStock && addToCart(product)}
        >
            <div className="h-28 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden relative">
                {product.imagePath ? (
                    <img 
                        src={`http://localhost:9090${product.imagePath}`} 
                        alt={product.productName} 
                        className="max-h-full max-w-full object-contain"
                    />
                ) : (
                    <span className="text-gray-400 text-xs text-center">No Image</span>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-100/60 backdrop-blur-sm z-10">
                        <span className="text-red-700 font-bold text-lg uppercase border-2 border-red-700 px-2 py-1 rounded">
                            OUT OF STOCK
                        </span>
                    </div>
                )}
            </div>

            <h3 className="font-semibold text-sm truncate">{product.productName}</h3>
            <p className="text-sm text-green-600 font-bold">
                ₱{(product.retailPrice ?? 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
                Stock: <span className={isOutOfStock ? 'text-red-500 font-bold' : 'font-normal'}>
                    {stock}
                </span>
            </p>
        </div>
    );
};

// --- Cart Summary ---
const CartSummary = ({ cartItems, clearCart, currentUser }) => {
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + ((item.retailPrice ?? 0) * (item.quantity ?? 0)), 0);
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const processSale = () => {
        if (cartItems.length === 0) return;

        const sale = {
            id: Date.now(),
            date: new Date().toISOString(),
            cashier: currentUser,
            items: cartItems
        };

        const existingSales = JSON.parse(localStorage.getItem('processedSales')) || [];
        localStorage.setItem('processedSales', JSON.stringify([...existingSales, sale]));

        clearCart();

        setToastMessage(`Sale processed successfully! Total: ₱${total.toFixed(2)}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg h-full flex flex-col relative">
            <h2 className="text-xl font-bold mb-2">🛒 Current Sale</h2>
            <p className="text-sm text-gray-600 border-b pb-3 mb-4">
                Processed by: <span className="font-semibold text-blue-700">{currentUser || "Loading..."}</span>
            </p>
            
            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {cartItems.length === 0 && (
                    <p className="text-gray-500 text-center mt-10">Select products to add to cart.</p>
                )}
                {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                        <div className="w-3/4">
                            <p className="font-medium truncate">{item.productName}</p>
                            <p className="text-xs text-gray-500">
                                {item.quantity ?? 0} x ₱{((item.retailPrice ?? 0)).toFixed(2)}
                            </p>
                        </div>
                        <p className="font-semibold">
                            ₱{(((item.retailPrice ?? 0) * (item.quantity ?? 0))).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-base mb-1">
                    <span>Subtotal:</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base mb-3">
                    <span>Tax (8%):</span>
                    <span>₱{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-blue-700 border-t pt-3">
                    <span>Total:</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>

            <button 
                type="button"
                className={`w-full py-3 mt-4 text-white font-bold rounded-lg transition ${cartItems.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={cartItems.length === 0}
                onClick={processSale}
            >
                PROCESS SALE
            </button>
            <button 
                className="w-full py-2 mt-2 text-red-500 font-semibold border border-red-500 rounded-lg hover:bg-red-50 transition"
                onClick={clearCart}
            >
                Clear Cart
            </button>

            {showToast && (
                <div className="absolute top-4 right-4 bg-white shadow-lg border border-gray-300 px-4 py-3 rounded-lg z-50">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

// --- Main Point of Sale Component ---
const PointOfSale = ({ updatedProducts }) => { // <-- accept updated products from Inventory
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { username, firstName, lastName } = useAuth();
    const currentUser = `${firstName || username || ""} ${lastName || ""}`.trim();

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("You must be logged in to access the Point of Sale.");
                setLoading(false);
                return;
            }

            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            try {
                const response = await axios.get(`${API_BASE_URL}/products`, config); 
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load products. Check server connection and CORS."); 
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Update products if Inventory notifies of changes
    useEffect(() => {
        if (updatedProducts && updatedProducts.length > 0) {
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        }
    }, [updatedProducts]);

    const addToCart = useCallback((productToAdd) => {
        setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(item => item.id === productToAdd.id);
            if (existingIndex > -1) {
                const newItems = [...prevItems];
                if ((newItems[existingIndex].quantity ?? 0) < (productToAdd.stockQuantity ?? 0)) {
                    newItems[existingIndex].quantity += 1;
                } else {
                    alert(`Cannot add more than ${productToAdd.stockQuantity} of ${productToAdd.productName} to the cart.`);
                }
                return newItems;
            } else {
                if ((productToAdd.stockQuantity ?? 0) > 0) {
                    return [...prevItems, { ...productToAdd, quantity: 1 }];
                } else {
                    alert(`${productToAdd.productName} is currently out of stock.`);
                    return prevItems;
                }
            }
        });
    }, []);

    const clearCart = () => setCartItems([]);

    const handleSearch = (query) => {
        const q = query.toLowerCase();
        setFilteredProducts(products.filter(p => p.productName.toLowerCase().includes(q)));
    };

    if (loading) return <div className="p-8 text-center text-xl">Loading Products...</div>;
    if (error) return <div className="p-8 text-center text-red-600 text-xl">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Point of Sale</h1>
                <p className="text-lg text-gray-600">
                    <span className="font-semibold">User:</span> {currentUser || "Loading..."}
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-4 relative w-80">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-3 pl-10 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
                <div className="lg:col-span-2 xl:col-span-3">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Catalog ({filteredProducts.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[80vh] p-1">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                addToCart={addToCart} 
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 xl:col-span-1">
                    <CartSummary 
                        cartItems={cartItems} 
                        clearCart={clearCart}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </div>
    );
};

export default PointOfSale;
