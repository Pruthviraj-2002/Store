"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  MapPinIcon,
  TruckIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheckCircle } from '@heroicons/react/24/solid';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) {
      setTrackError('Please provide both order ID and email');
      return;
    }

    setIsLoading(true);
    setTrackError(null);

    try {
      const response = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to find order');
      }

      const [order] = result.orders || [];
      if (!order) {
        setTrackError('No order was found for that email and ID combination.');
        setOrderDetails(null);
        setIsTracking(false);
      } else {
        setOrderDetails(order);
        setIsTracking(true);
      }
    } catch (error) {
      setTrackError((error as Error).message);
      setOrderDetails(null);
      setIsTracking(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="grow max-w-250 w-full mx-auto px-4 md:px-8 py-12">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Enter your Order ID and the email address you used during checkout to see the real-time status of your package.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Order ID</label>
              <input 
                type="text" 
                required
                placeholder="e.g. SK-883920" 
                className="w-full px-4 py-3 border border-gray-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="you@company.com" 
                className="w-full px-4 py-3 border border-gray-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded font-bold transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 h-11.5"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Track
              </button>
            </div>
          </form>
        </div>

        {/* Tracking Results (Visible only after form submission) */}
        {trackError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {trackError}
          </div>
        )}

        {isTracking && orderDetails && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              {/* Header */}
              <div className="bg-gray-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{orderDetails.order_id || orderId.toUpperCase()}</h2>
                  <p className="text-gray-400 text-sm mt-1">Placed on {new Date(orderDetails.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Expected Delivery</p>
                  <p className="text-xl font-bold text-green-400">{orderDetails.expected_delivery || 'TBD'}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="p-8 md:p-12 overflow-x-auto">
                <div className="min-w-150">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[66%] h-1 bg-blue-600 z-0 rounded"></div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <SolidCheckCircle className="h-6 w-6" />
                      </div>
                      <p className="mt-3 font-bold text-gray-900 text-sm">Order Placed</p>
                      <p className="text-xs text-gray-500 mt-0.5">{orderDetails.created_at ? new Date(orderDetails.created_at).toLocaleTimeString() : 'Pending'}</p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <CubeIcon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 font-bold text-gray-900 text-sm">Processing</p>
                      <p className="text-xs text-gray-500 mt-0.5">{orderDetails.processing_at ? new Date(orderDetails.processing_at).toLocaleDateString() : 'Pending'}</p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${orderDetails.status === 'Shipped' ? 'bg-white border-blue-600 text-blue-600 animate-pulse' : 'bg-white border-gray-300 text-gray-300'}`}>
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <p className={`mt-3 font-bold text-sm ${orderDetails.status === 'Shipped' ? 'text-blue-700' : 'text-gray-400'}`}>{orderDetails.status || 'Shipped'}</p>
                      <p className="text-xs text-blue-600 mt-0.5">In Transit</p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 bg-white border-2 border-gray-300 text-gray-300 rounded-full flex items-center justify-center">
                        <MapPinIcon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 font-medium text-gray-400 text-sm">Delivered</p>
                      <p className="text-xs text-gray-400 mt-0.5">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Delivery Address</h3>
                <p className="font-bold text-gray-800 text-sm">{orderDetails.customer_name || email}</p>
                <p className="text-gray-600 text-sm mt-1">{orderDetails.customer_email || email}</p>
                <p className="text-gray-600 text-sm mt-3 whitespace-pre-line">{orderDetails.shipping_address || 'No shipping address available.'}</p>
                <p className="text-gray-600 text-sm mt-3 flex items-center gap-2">
                  <span className="font-bold text-gray-900">Phone:</span> {orderDetails.phone || 'N/A'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Items in this shipment</h3>
                <div className="space-y-4">
                  {Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? (
                    orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="h-12 w-12 bg-gray-50 border border-gray-200 rounded p-1 shrink-0 flex items-center justify-center">
                          {item.img ? <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain" /> : <span className="text-xs text-gray-500">No Image</span>}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{item.name || item.desc || 'Product'}</p>
                          <p className="text-gray-500 text-xs mt-0.5">Qty: {item.qty || 1}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No item details are available for this order.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}