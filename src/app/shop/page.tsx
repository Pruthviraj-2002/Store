"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function ShopPage() {
  // 1. Local State for Database Data
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Global Zustand State
  const searchQuery = useStore((state) => state.searchQuery);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const addToCart = useStore((state) => state.addToCart);
  const toggleCart = useStore((state) => state.toggleCart);

  // 3. Fetch Live Data from Supabase
  useEffect(() => {
    async function fetchLiveProducts() {
      // Pull everything from the 'products' table where the status is Active
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "Active");

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    }

    fetchLiveProducts();
  }, []);

  // 4. Apply Filters to the Live Data
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Component Inventory</h1>

      {isLoading ? (
        // Loading Skeleton UI
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        // No Results State
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No components found matching your criteria.</p>
        </div>
      ) : (
        // Live Data Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ₹{product.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => {
  // Pass the product object as argument 1, and the quantity number as argument 2
  addToCart({ ...product, img: product.image_url }, 1);
  toggleCart(); // Auto-open drawer
}}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}