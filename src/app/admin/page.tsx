"use client";

import React, { useState } from 'react';
import { 
  ArrowTrendingUpIcon, 
  CubeIcon, 
  ClockIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

// Mock Database for the Admin Panel
const INITIAL_INVENTORY = [
  { id: "p1", sku: "SKT-ARD-001", name: "Arduino Uno R3", stock: 50, price: 850.00, status: "Active" },
  { id: "p2", sku: "SKT-ESP-002", name: "ESP32 Dev Board", stock: 120, price: 320.00, status: "Active" },
  { id: "p3", sku: "SKT-RES-10K", name: "10K Ohm Resistor", stock: 10000, price: 0.25, status: "Active" },
  { id: "p4", sku: "SKT-CAP-10U", name: "10uF Capacitor", stock: 5, price: 2.50, status: "Low Stock" },
  { id: "p5", sku: "SKT-STM-103", name: "STM32F103C8T6", stock: 0, price: 85.00, status: "Out of Stock" },
];

export default function AdminDashboard() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  // --- Handlers for Admin Actions ---
  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        // Determine new status based on stock level
        let newStatus = "Active";
        if (newStock === 0) newStatus = "Out of Stock";
        else if (newStock < 20) newStatus = "Low Stock";
        
        return { ...item, stock: newStock, status: newStatus };
      }
      return item;
    }));
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Total Revenue</h3>
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">₹1,24,500</p>
          <p className="text-xs text-green-600 font-medium mt-2">+14% from last month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Pending Dispatches</h3>
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">24 Orders</p>
          <p className="text-xs text-gray-500 font-medium mt-2">Requires immediate processing</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Low Stock Alerts</h3>
            <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
              <CubeIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">2 Items</p>
          <p className="text-xs text-red-600 font-medium mt-2">Inventory update required</p>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Inventory Management</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            + Add New Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Name & SKU</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={item.stock}
                        onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-500">units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit Details">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors" 
                        title="Delete Product"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}