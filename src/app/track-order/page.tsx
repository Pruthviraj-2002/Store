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

  // Mock function to simulate tracking a package
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && email) {
      setIsTracking(true);
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
        {isTracking && (
          <div className="animate-fadeIn">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              {/* Header */}
              <div className="bg-gray-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{orderId.toUpperCase() || 'SK-883920'}</h2>
                  <p className="text-gray-400 text-sm mt-1">Placed on October 24, 2026</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Expected Delivery</p>
                  <p className="text-xl font-bold text-green-400">October 28, 2026</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="p-8 md:p-12 overflow-x-auto">
                <div className="min-w-150">
                  <div className="flex justify-between items-center relative">
                    {/* Connecting Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded"></div>
                    {/* Active Line (Shows progression) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[66%] h-1 bg-blue-600 z-0 rounded"></div>

                    {/* Step 1: Placed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <SolidCheckCircle className="h-6 w-6" />
                      </div>
                      <p className="mt-3 font-bold text-gray-900 text-sm">Order Placed</p>
                      <p className="text-xs text-gray-500 mt-0.5">Oct 24, 10:30 AM</p>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <CubeIcon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 font-bold text-gray-900 text-sm">Processing</p>
                      <p className="text-xs text-gray-500 mt-0.5">Oct 25, 08:15 AM</p>
                    </div>

                    {/* Step 3: Shipped (Current Status) */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 font-bold text-blue-700 text-sm">Shipped</p>
                      <p className="text-xs text-blue-600 mt-0.5">In Transit</p>
                    </div>

                    {/* Step 4: Delivered (Pending) */}
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

            {/* Delivery & Item Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Delivery Address</h3>
                <p className="font-bold text-gray-800 text-sm">John Doe</p>
                <p className="text-gray-600 text-sm mt-1">Tech Innovations Pvt. Ltd.</p>
                <p className="text-gray-600 text-sm">Block C, 4th Floor, Cyber Park</p>
                <p className="text-gray-600 text-sm">Hyderabad, Telangana 500081</p>
                <p className="text-gray-600 text-sm">India</p>
                <p className="text-gray-600 text-sm mt-3 flex items-center gap-2">
                  <span className="font-bold text-gray-900">Phone:</span> +91 98765 43210
                </p>
              </div>

              {/* Order Items Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Items in this shipment</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 bg-gray-50 border border-gray-200 rounded p-1 shrink-0">
                      <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=80" alt="STM32" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">STM32F103C8T6 MCU</p>
                      <p className="text-gray-500 text-xs mt-0.5">Qty: 2</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 bg-gray-50 border border-gray-200 rounded p-1 shrink-0">
                      <img src="https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=100&q=80" alt="Resistor" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">1KΩ 1/4W Resistor</p>
                      <p className="text-gray-500 text-xs mt-0.5">Qty: 50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}