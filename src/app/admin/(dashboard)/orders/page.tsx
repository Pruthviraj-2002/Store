"use client";

import React, { useEffect, useState } from 'react';
import {
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface OrderRow {
  id: string;
  order_id?: string;
  customer_name?: string;
  customer_email?: string;
  total?: number;
  items?: Array<any>;
  status?: string;
  created_at?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load orders');
      setOrders(Array.isArray(result.orders) ? result.orders : []);
    } catch (error) {
      console.error('Unable to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (order: OrderRow, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, order_id: order.order_id, status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update order');
      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: newStatus } : item)));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to update order');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer_name || '';
    const email = order.customer_email || '';
    const orderId = order.order_id || order.id || '';
    const term = searchTerm.toLowerCase();
    return orderId.toLowerCase().includes(term) || customerName.toLowerCase().includes(term) || email.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : (
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
                  filteredOrders.map((order) => {
                    const status = order.status || 'Pending';
                    const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{order.order_id || order.id}</td>
                        <td className="px-6 py-4 text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.customer_name || 'Guest Customer'}</div>
                          <div className="text-xs text-gray-500">{order.customer_email || 'No email'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">₹{Number(order.total || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{itemCount} items</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Delivered' ? 'bg-green-100 text-green-800' : status === 'Dispatched' ? 'bg-purple-100 text-purple-800' : status === 'Processing' ? 'bg-blue-100 text-blue-800' : status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {status === 'Pending' && <button onClick={() => handleUpdateStatus(order, 'Processing')} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors">Process</button>}
                            {status === 'Processing' && <button onClick={() => handleUpdateStatus(order, 'Dispatched')} className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors"><TruckIcon className="h-3.5 w-3.5" /> Dispatch</button>}
                            {status === 'Dispatched' && <button onClick={() => handleUpdateStatus(order, 'Delivered')} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors"><CheckCircleIcon className="h-3.5 w-3.5" /> Mark Delivered</button>}
                            <button className="text-gray-400 hover:text-gray-900 transition-colors p-1" title="View Order Details"><EyeIcon className="h-5 w-5" /></button>
                            {(status === 'Pending' || status === 'Processing') && <button onClick={() => handleUpdateStatus(order, 'Cancelled')} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Cancel Order"><XCircleIcon className="h-5 w-5" /></button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}