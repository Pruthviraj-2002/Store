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
import { supabaseBrowser } from '@/lib/supabase';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const fetchOrderDetails = async (searchOrderId: string, searchEmail: string) => {
    setIsLoading(true);
    setTrackError(null);

    try {
      const response = await fetch(`/api/orders?orderId=${encodeURIComponent(searchOrderId)}&email=${encodeURIComponent(searchEmail)}`);
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
        setOrderId(order.order_number || order.order_id || searchOrderId);
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

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) {
      setTrackError('Please provide both order ID and email');
      return;
    }
    fetchOrderDetails(orderId, email);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qOrderId = urlParams.get('orderId');
      const qEmail = urlParams.get('email');
      
      if (qOrderId && qEmail) {
        setOrderId(qOrderId);
        setEmail(qEmail);
        fetchOrderDetails(qOrderId, qEmail);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!orderDetails?.id || !supabaseBrowser) return;

    const channel = supabaseBrowser
      .channel(`order_tracking_${orderDetails.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderDetails.id}`
        },
        (payload) => {
          if (payload.new) {
            setOrderDetails((prev: any) => ({
              ...prev,
              status: payload.new.status,
              // Update any other fields you want to be reactive here
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser?.removeChannel(channel);
    };
  }, [orderDetails?.id]);

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
                  <h2 className="text-xl font-bold">Order #{orderDetails.order_number || orderDetails.order_id || orderId.toUpperCase()}</h2>
                  <p className="text-gray-400 text-sm mt-1">Placed on {new Date(orderDetails.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Expected Delivery</p>
                  <p className="text-xl font-bold text-green-400">{orderDetails.expected_delivery || 'TBD'}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              {(() => {
                const status = orderDetails.status || 'pending';
                let progress = '33%'; // Default paid
                let isProcessing = false;
                let isShipped = false;
                let isDelivered = false;
                
                if (status === 'packed') {
                  progress = '66%';
                  isProcessing = true;
                } else if (status === 'shipped') {
                  progress = '80%';
                  isProcessing = true;
                  isShipped = true;
                } else if (status === 'delivered') {
                  progress = '100%';
                  isProcessing = true;
                  isShipped = true;
                  isDelivered = true;
                } else if (status === 'cancelled' || status === 'returned' || status === 'refunded') {
                  progress = '0%';
                } else if (status === 'paid') {
                  progress = '33%';
                }

                return (
                  <div className="p-8 md:p-12 overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="flex justify-between relative">
                        {/* The line should be vertically centered relative to the 16px (h-4) circles, so top-2 (8px) */}
                        <div className="absolute left-0 top-2 w-full h-[2px] bg-gray-100 z-0"></div>
                        <div className={`absolute left-0 top-2 h-[2px] ${status === 'cancelled' ? 'bg-red-500' : 'bg-gray-900'} z-0 transition-all duration-1000`} style={{ width: progress }}></div>

                        {/* Order Placed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full border-2 ${status === 'cancelled' ? 'border-red-500 bg-red-500' : 'border-gray-900 bg-gray-900'}`}></div>
                          <p className="mt-4 font-medium text-gray-900 text-sm">Order Placed</p>
                          <p className="text-xs text-gray-500 mt-1">{orderDetails.created_at ? new Date(orderDetails.created_at).toLocaleDateString() : 'Pending'}</p>
                        </div>

                        {/* Packed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full border-2 transition-colors duration-500 ${isProcessing ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'}`}></div>
                          <p className={`mt-4 font-medium text-sm ${isProcessing ? 'text-gray-900' : 'text-gray-400'}`}>Packed</p>
                        </div>

                        {/* Shipped */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full border-2 transition-colors duration-500 ${isShipped ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'}`}></div>
                          <p className={`mt-4 font-medium text-sm ${isShipped ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</p>
                        </div>

                        {/* Delivered */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full border-2 transition-colors duration-500 ${isDelivered ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'}`}></div>
                          <p className={`mt-4 font-medium text-sm ${isDelivered ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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