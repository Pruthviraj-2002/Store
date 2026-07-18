"use client";

import React, { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, CubeIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setInventory(data as Product[]);
    }
    setIsLoading(false);
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', id);
    if (!error) {
      setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item)));
    } else {
      alert('Could not update stock.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product from the storefront?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert('Could not delete product.');
    }
  };

  const lowStockCount = inventory.filter((item) => item.stock < 20).length;
  const outOfStockCount = inventory.filter((item) => item.stock === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Inventory Value</h3>
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">₹{totalValue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-green-600 font-medium mt-2">Live from Supabase</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Pending Dispatches</h3>
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">0 Orders</p>
          <p className="text-xs text-gray-500 font-medium mt-2">Orders view is ready for live data</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Low Stock Alerts</h3>
            <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
              <CubeIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{lowStockCount + outOfStockCount} Items</p>
          <p className="text-xs text-red-600 font-medium mt-2">Inventory update required</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Inventory Management</h3>
          <a href="/admin/products" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Manage Products
          </a>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory...</div>
          ) : (
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
                {inventory.map((item) => {
                  const status = item.stock === 0 ? 'Out of Stock' : item.stock < 20 ? 'Low Stock' : 'Active';
                  return (
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Active' ? 'bg-green-100 text-green-800' : status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteProduct(item.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete Product">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}