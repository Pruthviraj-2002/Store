"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { useStore } from '@/store/useStore';

export default function ShopPage() {
  const { selectedCategory, addToCart } = useStore();
  
  // State to hold our live database products
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the backend API as soon as the page loads
  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to load products');
        }
        
        // Ensure we always have an array, even if the API returns something unexpected
        setProducts(Array.isArray(result) ? result : result.products || []);
      } catch (error) {
        console.error('Error fetching database:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, []);

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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grow">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Sidebar />
          </div>

          {/* Right Product Grid */}
          <div className="flex-1">
            
            {/* Page Header */}
            <div className="mb-6 pb-4 border-b border-gray-200 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {selectedCategory || "All Categories"}
                </h1>
                <p className="text-gray-500 mt-1 font-medium">
                  {isLoading ? "Loading inventory..." : `Showing ${filteredProducts.length} results`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const imageSrc = product.image_url || product.img || product.images?.[0] || '';
                  return (
                  <div key={product.id} className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all bg-white group cursor-pointer flex flex-col">
                    
                    <div className="h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {imageSrc ? (
                        <img src={imageSrc} alt={product.name} className="object-cover h-full w-full" />
                      ) : (
                        <span className="text-gray-400 font-bold group-hover:scale-110 transition-transform">
                          [ No Image ]
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      {/* FIX: Look for the nested Supabase category name first */}
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                        {product.categories?.name || product.category || 'Hardware'}
                      </p>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mb-4">
                        Stock: {product.stock} units
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-gray-900 font-black text-xl">₹{product.price}</p>
                      <button 
                        onClick={() => addToCart(product)} 
                        className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-600 transition-colors active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              
              /* Empty State */
              <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No components found</h3>
                <p className="text-gray-500">We don't have any stock for this category right now.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}