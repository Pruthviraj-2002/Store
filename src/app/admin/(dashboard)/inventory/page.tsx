"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { createAdminClient } from '@/utils/supabase/client';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories?: { name: string | null } | null;
}

export default function InventoryPage() {
  const supabase = createAdminClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  useEffect(() => {
    void fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, created_at, categories(name), product_variants(sku, base_price, inventory(quantity))')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      const flattened = data.map((p: any) => {
        const variant = Array.isArray(p.product_variants) ? p.product_variants[0] : p.product_variants;
        const inv = variant ? (Array.isArray(variant.inventory) ? variant.inventory[0] : variant.inventory) : null;
        
        return {
          id: p.id,
          name: p.name,
          categories: Array.isArray(p.categories) ? p.categories[0] : p.categories,
          sku: variant?.sku || 'N/A',
          price: variant?.base_price || 0,
          stock: inv?.quantity || 0,
          created_at: p.created_at
        };
      });
      setProducts(flattened as (Product & { created_at: string })[]);
    } else if (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  // Derive available categories dynamically from the product list
  const availableCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.categories?.name).filter(Boolean));
    return Array.from(cats) as string[];
  }, [products]);

  // Derived state: Filtered & Sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.categories?.name === selectedCategory);
    }

    // 3. Status Filter
    if (selectedStatus !== "All") {
      result = result.filter(p => {
        const status = p.stock === 0 ? 'Out of Stock' : p.stock < 20 ? 'Low Stock' : 'Active';
        return status === selectedStatus;
      });
    }

    // 4. Sorting
    switch (sortOption) {
      case "Name (A-Z)":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name (Z-A)":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price (Low to High)":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price (High to Low)":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Stock (Lowest First)":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "Stock (Highest First)":
        result.sort((a, b) => b.stock - a.stock);
        break;
      default: // "Newest" - assuming they are already sorted by created_at desc from API, but we'll leave it as is.
        break; 
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedStatus, sortOption]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h1>
          <p className="text-sm text-gray-500">Live catalog from your Supabase products table.</p>
        </div>
        <a href="/admin/products" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
          Open Product Manager
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* --- ADVANCED TOOLBAR --- */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-96 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Filters & Sorts */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            
            <div className="relative flex items-center flex-1 lg:flex-none">
              <FunnelIcon className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-48 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="All">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative flex items-center flex-1 lg:flex-none">
              <FunnelIcon className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full lg:w-48 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="relative flex items-center w-full lg:w-auto">
              <ArrowsUpDownIcon className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full lg:w-56 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Name (A-Z)">Name (A-Z)</option>
                <option value="Name (Z-A)">Name (Z-A)</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
                <option value="Stock (Lowest First)">Stock (Lowest First)</option>
                <option value="Stock (Highest First)">Stock (Highest First)</option>
              </select>
            </div>

          </div>
        </div>
        
        {/* --- DATA TABLE --- */}
        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
               <p className="text-gray-500 font-medium">Loading inventory data...</p>
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="py-24 text-center">
               <p className="text-gray-900 font-bold text-lg mb-1">No items found</p>
               <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
               <button 
                 onClick={() => {
                   setSearchQuery("");
                   setSelectedCategory("All");
                   setSelectedStatus("All");
                   setSortOption("Newest");
                 }} 
                 className="mt-4 text-blue-600 font-bold hover:text-blue-800 transition-colors"
               >
                 Clear all filters
               </button>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Item Name & SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-900 bg-white">
                {processedProducts.map((item) => {
                  const status = item.stock === 0 ? 'Out of Stock' : item.stock < 20 ? 'Low Stock' : 'Active';
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[11px] font-mono font-bold text-gray-400 mt-0.5">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {item.categories?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-gray-700">{item.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          status === 'Active' ? 'bg-green-100 text-green-700' : 
                          status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
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