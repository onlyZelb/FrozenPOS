import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Transactions = () => {
    const [sales, setSales] = useState([]);
    const { username, firstName, lastName } = useAuth();
    const currentUser = `${firstName || username || ""} ${lastName || ""}`.trim();

    useEffect(() => {
        const storedSales = JSON.parse(localStorage.getItem('processedSales')) || [];
        setSales(storedSales);
    }, []);

    const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Processed Transactions</h1>

            {sales.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No transactions processed yet.</p>
            ) : (
                <div className="space-y-6">
                    {sales.map(sale => {
                        const subtotal = sale.items.reduce((sum, item) => sum + (item.retailPrice * item.quantity), 0);
                        const tax = subtotal * 0.08;
                        const total = subtotal + tax;

                        // Ensure cashier shows full name or currentUser if missing
                        const cashierName = sale.cashier || currentUser;

                        return (
                            <div key={sale.id} className="bg-white p-4 shadow-lg rounded-lg">
                                <div className="flex justify-between items-center border-b pb-2 mb-2">
                                    <h2 className="text-lg font-semibold">Sale #{sale.id}</h2>
                                    <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleString()}</p>
                                </div>

                                <p className="text-sm mb-2">
                                    Processed by: <span className="font-medium text-blue-700">{cashierName}</span>
                                </p>

                                <ul className="mb-2">
                                    {sale.items.map(item => (
                                        <li key={item.id} className="flex justify-between items-center mb-1">
                                            <div className="flex items-center space-x-2">
                                                {item.imagePath && (
                                                    <img 
                                                        src={`http://localhost:9090${item.imagePath}`} 
                                                        alt={item.productName} 
                                                        className="h-8 w-8 object-contain"
                                                    />
                                                )}
                                                <span>{item.quantity} x {item.productName}</span>
                                            </div>
                                            <span className="font-semibold">{formatCurrency(item.retailPrice * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (8%):</span>
                                        <span>{formatCurrency(tax)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-blue-700 text-lg">
                                        <span>Total:</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Link to="/pos" className="mt-6 inline-block text-blue-500 hover:text-blue-700 font-medium transition">
                ← Back to Point of Sale
            </Link>
        </div>
    );
};

export default Transactions;
