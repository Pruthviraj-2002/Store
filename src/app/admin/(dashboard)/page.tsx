"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ArrowTrendingUpIcon, CubeIcon, ClockIcon, TrashIcon, UserGroupIcon, CurrencyRupeeIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { createAdminClient } from '@/utils/supabase/client';
import { useStore } from '@/store/useStore';

interface ProductRow {
  id: string;
  variant_id: string | null;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface OrderRow {
  id: string;
  customer_email?: string;
  profiles?: { email: string };
  grand_total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const supabase = createAdminClient();
  const [inventory, setInventory] = useState<ProductRow[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  
  // Metrics
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    cancelledOrders: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  const { realtimeUpdateTrigger, showToast } = useStore();
  const prevTrigger = useRef(realtimeUpdateTrigger);

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  // Listen to global realtime updates
  useEffect(() => {
    if (realtimeUpdateTrigger > prevTrigger.current) {
      prevTrigger.current = realtimeUpdateTrigger;
      // Fetch fresh data in the background silently
      void fetchDashboardData(true);
    }
  }, [realtimeUpdateTrigger]);

  const fetchDashboardData = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    
    // 1. Fetch Inventory (Existing logic)
    const { data: invData, error: invError } = await supabase
      .from('products')
      .select('id, name, created_at, product_variants(id, sku, base_price, inventory(quantity))')
      .order('created_at', { ascending: false });
      
    if (!invError && invData) {
      const flattened = invData.map((p: any) => {
        const variant = Array.isArray(p.product_variants) ? p.product_variants[0] : p.product_variants;
        const inv = variant ? (Array.isArray(variant.inventory) ? variant.inventory[0] : variant.inventory) : null;
        
        return {
          id: p.id,
          variant_id: variant?.id || null,
          name: p.name,
          sku: variant?.sku || 'No SKU',
          price: variant?.base_price || 0,
          stock: inv?.quantity || 0,
        };
      });
      setInventory(flattened);
    }

    // 2. Fetch Orders for metrics
    let ordersData: any[] = [];
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      ordersData = json.orders || [];
    } catch (e) {
      console.error(e);
    }

    // 3. Fetch Customers count
    let customersCount = 0;
    try {
      const res = await fetch('/api/customers');
      const json = await res.json();
      customersCount = (json.customers || []).length;
    } catch (e) {
      console.error(e);
    }

    if (ordersData) {
      const validOrders = ordersData.filter((o: any) => !['cancelled', 'returned', 'refunded'].includes((o.status || '').toLowerCase()));
      const cancelledOrders = ordersData.filter((o: any) => ['cancelled', 'returned', 'refunded'].includes((o.status || '').toLowerCase()));
      
      const revenue = validOrders.reduce((sum: number, o: any) => sum + Number(o.total || o.grand_total || 0), 0);
        
      setMetrics({
        totalRevenue: revenue,
        totalOrders: validOrders.length,
        totalCustomers: customersCount || 0,
        cancelledOrders: cancelledOrders.length,
      });
      
      // Top 5 recent orders
      const mappedRecent = ordersData.slice(0, 5).map((o: any) => ({
        id: o.id || o.order_id,
        customer_email: o.customer_email || 'Guest',
        grand_total: Number(o.total || o.grand_total || 0),
        status: o.status,
        created_at: o.created_at
      }));
      setRecentOrders(mappedRecent as OrderRow[]);
    }

    if (!isBackground) setIsLoading(false);
  };

  const handleUpdateStock = async (variant_id: string | null, newStock: number) => {
    if (!variant_id) return alert('No variant found for this product.');
    
    const { error } = await supabase.from('inventory').update({ quantity: newStock }).eq('variant_id', variant_id);
    if (!error) {
      setInventory((prev) => prev.map((item) => (item.variant_id === variant_id ? { ...item, stock: newStock } : item)));
    } else {
      alert('Could not update stock.');
      console.error(error);
    }
  };

  const lowStockCount = inventory.filter((item) => item.stock < 20).length;
  const outOfStockCount = inventory.filter((item) => item.stock === 0).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Hero Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back, Admin</h1>
          <p className="text-blue-100 font-medium">Here's what's happening with your store today.</p>
        </div>
        <div className="absolute -right-10 -top-10 opacity-10">
          <ArrowTrendingUpIcon className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Total Revenue</h3>
            <div className="h-10 w-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors">
              <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">₹{metrics.totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-green-600 font-bold mt-2 flex items-center">
             <ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> Overall Earnings
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Total Orders</h3>
            <div className="h-10 w-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
              <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{metrics.totalOrders}</p>
          <p className="text-xs text-gray-500 font-medium mt-2">All-time orders</p>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Customers</h3>
            <div className="h-10 w-10 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center transition-colors">
              <UserGroupIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{metrics.totalCustomers}</p>
          <p className="text-xs text-gray-500 font-medium mt-2">Registered accounts</p>
        </div>

        {/* Stock Alerts Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Stock Alerts</h3>
            <div className="h-10 w-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors">
              <CubeIcon className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{lowStockCount + outOfStockCount}</p>
          <p className="text-xs text-orange-600 font-medium mt-2 flex items-center">
             Items need restocking
          </p>
        </div>

        {/* Cancelled Orders Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Cancelled</h3>
            <div className="h-10 w-10 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
              <TrashIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{metrics.cancelledOrders}</p>
          <p className="text-xs text-red-600 font-medium mt-2 flex items-center">
             Unfulfilled orders
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table (Takes up 2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All &rarr;</a>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No orders yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.customer_email || 'Guest'}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-bold">₹{Number(order.grand_total).toFixed(2)}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'}`}>
                           {order.status}
                         </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Inventory (Takes up 1/3 width) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
            <h3 className="text-lg font-bold text-gray-900">Quick Stock</h3>
            <a href="/admin/products" className="text-sm font-bold text-blue-600 hover:text-blue-700">Manage &rarr;</a>
          </div>
          <div className="overflow-y-auto flex-grow p-4 space-y-3 custom-scrollbar">
             {inventory.slice(0, 10).map((item) => {
                const status = item.stock === 0 ? 'Out' : item.stock < 20 ? 'Low' : 'OK';
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors bg-white">
                     <div className="overflow-hidden pr-2">
                        <div className="font-bold text-sm text-gray-900 truncate">{item.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${status === 'OK' ? 'bg-green-500' : status === 'Low' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{item.sku}</span>
                        </div>
                     </div>
                     <div className="shrink-0 flex items-center gap-2">
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleUpdateStock(item.variant_id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1.5 text-sm font-bold text-center border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                     </div>
                  </div>
                )
             })}
             {inventory.length > 10 && (
               <div className="text-center pt-2 pb-1">
                 <p className="text-xs text-gray-400 font-medium">+ {inventory.length - 10} more items</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}