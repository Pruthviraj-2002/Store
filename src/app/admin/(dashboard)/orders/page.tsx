"use client";

import React, { useEffect, useState } from 'react';
import {
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { supabaseBrowser } from '@/lib/supabase';

interface OrderRow {
  id: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  phone?: string;
  subtotal?: number;
  shipping_fee?: number;
  gst_amount?: number;
  discount_amount?: number;
  total?: number;
  items?: Array<any>;
  status?: string;
  created_at?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  useEffect(() => {
    void fetchOrders();

    if (!supabaseBrowser) return;
    const channel = supabaseBrowser
      .channel('admin-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders(true);
        }
      )
      .subscribe();

    // Fallback polling every 5 seconds just in case Realtime isn't enabled on the table
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 5000);

    return () => {
      supabaseBrowser?.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load orders');
      
      const fetchedOrders = Array.isArray(result.orders) ? result.orders : [];
      setOrders(fetchedOrders);
      
      setSelectedOrder((currentSelected) => {
        if (!currentSelected) return null;
        const updated = fetchedOrders.find((o: OrderRow) => o.id === currentSelected.id);
        return updated || currentSelected;
      });
      
    } catch (error) {
      console.error('Unable to load orders:', error);
      if (!isBackground) setOrders([]);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, orderNumber: string | undefined, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, order_number: orderNumber, status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update order');
      
      setOrders((prev) => prev.map((item) => (item.id === orderId ? { ...item, status: newStatus } : item)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to update order');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer_name || '';
    const email = order.customer_email || '';
    const orderId = order.order_number || order.id || '';
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 space-y-4">
               <div className="animate-pulse flex flex-col gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>
                 ))}
               </div>
            </div>
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
                    const status = order.status || 'pending';
                    const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                    return (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900">{order.order_number || order.id}</td>
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
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'delivered' ? 'bg-green-100 text-green-800' : status === 'shipped' ? 'bg-purple-100 text-purple-800' : status === 'packed' ? 'bg-blue-100 text-blue-800' : status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            {status === 'paid' && <button onClick={() => handleUpdateStatus(order.id, order.order_number, 'packed')} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors">Pack</button>}
                            {status === 'packed' && <button onClick={() => handleUpdateStatus(order.id, order.order_number, 'shipped')} className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors"><TruckIcon className="h-3.5 w-3.5" /> Ship</button>}
                            {status === 'shipped' && <button onClick={() => handleUpdateStatus(order.id, order.order_number, 'delivered')} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors"><CheckCircleIcon className="h-3.5 w-3.5" /> Mark Delivered</button>}
                            <button onClick={() => setSelectedOrder(order)} className="text-gray-400 hover:text-gray-900 transition-colors p-1" title="View Order Details"><EyeIcon className="h-5 w-5" /></button>
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

      {/* Order Details Modal Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md transform transition-all translate-x-0">
              <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-scroll">
                
                {/* Modal Header */}
                <div className="px-6 py-6 bg-gray-50 border-b border-gray-200 sm:px-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900" id="slide-over-title">
                      Order Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.order_number || selectedOrder.id}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none bg-white p-1 shadow-sm border border-gray-200"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 px-4 py-6 sm:px-8 space-y-8">
                  
                  {/* Status Management */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Status</h3>
                    <div className="relative">
                      <select
                        value={selectedOrder.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(selectedOrder.id, selectedOrder.order_number, e.target.value)}
                        className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl bg-gray-50 font-bold text-gray-700 shadow-sm border appearance-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                         <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Update status manually if an override is required.</p>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Customer Information</h3>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-4 text-sm shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Name</span>
                        <span className="font-bold text-gray-900">{selectedOrder.customer_name || 'Guest'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Email</span>
                        <span className="font-bold text-gray-900">{selectedOrder.customer_email || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Phone</span>
                        <span className="font-bold text-gray-900">{selectedOrder.phone || '—'}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <span className="text-gray-500 font-medium block mb-2">Shipping Address</span>
                        <span className="font-medium text-gray-900 leading-relaxed block">{selectedOrder.shipping_address || 'No address provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Items Purchased</h3>
                    <div className="space-y-3">
                      {(selectedOrder.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                          {item.img ? (
                            <img src={item.img} alt={item.name} className="h-14 w-14 rounded-lg bg-gray-50 object-cover border border-gray-100" />
                          ) : (
                            <div className="h-14 w-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No Img</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs font-medium text-gray-500 mt-0.5">Qty: {item.qty} × ₹{Number(item.price || 0).toFixed(2)}</p>
                          </div>
                          <div className="text-sm font-black text-blue-600">
                            ₹{(Number(item.qty || 1) * Number(item.price || 0)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Summary</h3>
                    {(() => {
                      const grandTotal = Number(selectedOrder.total || 0);
                      const shippingFee = Number(selectedOrder.shipping_fee || 0);
                      const discount = Number(selectedOrder.discount_amount || 0);
                      
                      // Calculate 18% inclusive GST if the DB recorded 0
                      const taxes = (selectedOrder.gst_amount != null && selectedOrder.gst_amount > 0)
                        ? Number(selectedOrder.gst_amount) 
                        : (grandTotal * 0.18) / 1.18;
                      
                      // Always strictly derive the subtotal to ensure the math adds up!
                      const subtotal = grandTotal - taxes - shippingFee + discount;

                      return (
                        <div className="bg-gray-900 p-5 rounded-xl space-y-3 text-sm text-gray-300 shadow-lg">
                          <div className="flex justify-between">
                            <span>Subtotal (Excl. Tax)</span>
                            <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="text-white font-medium">₹{shippingFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes (18% GST)</span>
                            <span className="text-white font-medium">₹{taxes.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-green-400">
                              <span>Discount</span>
                              <span className="font-medium">-₹{discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-white text-lg border-t border-gray-700 pt-4 mt-4">
                            <span className="font-bold">Grand Total</span>
                            <span className="font-black">₹{grandTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}