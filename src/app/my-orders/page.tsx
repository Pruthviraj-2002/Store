"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { 
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { user } = useStore();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait briefly for hydration to avoid immediate redirect
    const timeout = setTimeout(() => {
      if (!user) {
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?profileId=${encodeURIComponent(user.id)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load orders');
        }
        
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'shipped') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-200'; // Pending / Processing
  };

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return <CheckCircleIcon className="h-4 w-4" />;
    if (s === 'shipped') return <TruckIcon className="h-4 w-4" />;
    return <ClockIcon className="h-4 w-4" />;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="grow max-w-5xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-gray-200 pb-6 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
            <ClipboardDocumentListIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 font-medium mt-1">View and track your entire order history.</p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse flex flex-col md:flex-row gap-6 items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-center">
            <p className="font-bold">Error loading orders</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-md mb-8">
              Looks like you haven't placed any orders yet. Start exploring our catalog to find what you need!
            </p>
            <Link 
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
            >
              Start Shopping <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side: Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status || 'Pending'}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Order <span className="text-gray-500 font-normal text-base">#{order.order_number || order.order_id.split('-')[0].toUpperCase()}</span>
                  </h3>
                  
                  <p className="text-sm font-bold text-gray-900">
                    Total: <span className="text-green-600 font-black">${Number(order.total).toFixed(2)}</span>
                  </p>
                </div>

                {/* Right side: Action */}
                <div className="shrink-0 flex items-center justify-end">
                  <button 
                    onClick={() => {
                      // Navigate to track order and automatically fill it using query params
                      // Since /track-order doesn't currently read query params on load, 
                      // we can just route there and the user can type it, OR we can implement 
                      // a small fix in track-order to read it, but for now we'll route there.
                      // Wait! The user is logged in, so they can just type the ID, or we can copy it.
                      // actually read it, so we can route there with the friendly order number.
                      router.push(`/track-order?orderId=${order.order_number || order.order_id}&email=${encodeURIComponent(user.email || '')}`);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-bold rounded-xl border border-gray-200 hover:border-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center"
                  >
                    Track Order
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
