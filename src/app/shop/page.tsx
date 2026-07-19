"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';

export default function ShopPage() {
  const { selectedCategory, addToCart, realtimeUpdateTrigger } = useStore();
  const prevTrigger = React.useRef(realtimeUpdateTrigger);
  
  // State to hold our live database products
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the backend API
  const getProducts = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load products');
      }
      
      setProducts(Array.isArray(result) ? result : result.products || []);
    } catch (error) {
      console.error('Error fetching database:', error);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Listen to global realtime updates
  useEffect(() => {
    if (realtimeUpdateTrigger > prevTrigger.current) {
      prevTrigger.current = realtimeUpdateTrigger;
      // Fetch fresh data in the background silently
      getProducts(true);
    }
  }, [realtimeUpdateTrigger]);

  // The Bulletproof Filter: Handles nested Supabase relational data
  const filteredProducts = products.filter(product => {
    if (selectedCategory === "All Categories" || !selectedCategory) return true;
    
    return (
      product.category === selectedCategory ||             // If your API formats it flat
      product.category_id === selectedCategory ||          // If sidebar passes the raw ID
      product.categories?.name === selectedCategory ||     // If Supabase returns the joined Name
      product.categories?.slug === selectedCategory        // If Supabase returns the joined Slug
    );
  });

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Navbar />
      
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 grow">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
          
          {/* Left Sidebar (Sticky) */}
          <div className="w-full md:w-64 shrink-0 md:sticky md:top-24 h-fit">
            <Sidebar />
          </div>

          {/* Right Product Grid */}
          <div className="flex-1 min-w-0">
            
            {/* Page Header */}
            <div className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {selectedCategory || "All Categories"}
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                  {isLoading ? "Loading inventory..." : `Showing ${filteredProducts.length} results`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              
              /* Empty State */
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                <h3 className="text-2xl font-black text-gray-900 mb-3">No components found</h3>
                <p className="text-gray-500 font-medium">We don't have any stock for this category right now.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}