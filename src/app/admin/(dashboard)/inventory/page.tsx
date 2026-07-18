"use client";

import React, { useEffect, useState } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories?: { name: string | null } | null;
}

export default function InventoryPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*, categories(id, name)').order('created_at', { ascending: false });
    if (!error && data) {
      setProducts(data as Product[]);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h1>
          <p className="text-sm text-gray-500">Live catalog from your Supabase products table.</p>
        </div>
        <a href="/admin/products" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          Open Product Manager
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Item Name & SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {products.map((item) => {
                  const status = item.stock === 0 ? 'Out of Stock' : item.stock < 20 ? 'Low Stock' : 'Active';
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.categories?.name || 'Uncategorized'}</td>
                      <td className="px-6 py-4 font-medium">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-medium">{item.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Active' ? 'bg-green-100 text-green-800' : status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {status}
                        </span>
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