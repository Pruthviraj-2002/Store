"use client";

import React, { useState } from 'react';
import { 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Mock Database for Orders
const INITIAL_ORDERS = [
  { 
    id: "ORD-7029", 
    date: "2026-06-26", 
    customer: "Rahul Sharma", 
    email: "rahul.s@example.com",
    total: 3450.00, 
    items: 4,
    status: "Pending" 
  },
  { 
    id: "ORD-7028", 
    date: "2026-06-25", 
    customer: "TechNova Solutions", 
    email: "procurement@technova.in",
    total: 12500.00, 
    items: 150,
    status: "Processing" 
  },
  { 
    id: "ORD-7027", 
    date: "2026-06-25", 
    customer: "Anita Desai", 
    email: "anita.d@example.com",
    total: 850.00, 
    items: 1,
    status: "Dispatched" 
  },
  { 
    id: "ORD-7026", 
    date: "2026-06-24", 
    customer: "Kiran Kumar", 
    email: "kiran99@example.com",
    total: 420.50, 
    items: 5,
    status: "Delivered" 
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");

  // Handler to update the status of an order
  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  // Filter orders based on search
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Dispatch</h1>
          <p className="text-sm text-gray-500">Manage incoming orders and track shipments.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">₹{order.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{order.items} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Dispatched' ? 'bg-purple-100 text-purple-800' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800' // Pending
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Update Dropdown (Simulated with quick actions for UI sake) */}
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Processing')}
                            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors"
                          >
                            Process
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Dispatched')}
                            className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors"
                          >
                            <TruckIcon className="h-3.5 w-3.5" /> Dispatch
                          </button>
                        )}
                        {order.status === 'Dispatched' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                            className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors"
                          >
                            <CheckCircleIcon className="h-3.5 w-3.5" /> Mark Delivered
                          </button>
                        )}

                        <button className="text-gray-400 hover:text-gray-900 transition-colors p-1" title="View Order Details">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        
                        {(order.status === 'Pending' || order.status === 'Processing') && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1" 
                            title="Cancel Order"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}