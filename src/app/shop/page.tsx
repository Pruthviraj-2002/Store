"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar'; // Implemented the functional shared sidebar!
import ProductCard from '@/components/product-card'; // Implemented the functional shared product card!
import { useStore } from '@/store/useStore';
import { 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// --- MOCK DATA ---
// (Make sure IDs match the ones we used in the Product Details Page so routing works perfectly)
const PRODUCTS = [
  {
    id: "p1", brand: "Arduino", name: "Arduino Uno R3", category: "Development Boards",
    desc: "ATmega328P Microcontroller Board with 14 digital I/O pins.", price: 850.00, stock: "In Stock (50)",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80"
  },
  {
    id: "p2", brand: "Espressif Systems", name: "ESP32 Dev Board", category: "Development Boards",
    desc: "Wi-Fi & Bluetooth MCU, Dual-core, 240MHz.", price: 320.00, stock: "In Stock (120)",
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=300&q=80"
  },
  {
    id: "p3", brand: "YAGEO", name: "10K Ohm Resistor", category: "Passive Components",
    desc: "1/4W 10K Ohm Through Hole Carbon Film Resistor", price: 0.25, stock: "In Stock (10000)",
    img: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=300&q=80"
  },
  {
    id: "p4", brand: "KEMET", name: "10uF Capacitor", category: "Passive Components",
    desc: "10uF 50V Aluminum Electrolytic Capacitor", price: 2.50, stock: "In Stock (5000)",
    img: "https://images.unsplash.com/photo-1580828343064-fde4cad202d5?w=300&q=80"
  },
  {
    id: "p5", brand: "STMicroelectronics", name: "STM32F103C8T6", category: "Semiconductors",
    desc: "ARM 32-bit Cortex-M3 MCU, 72MHz, 64KB Flash", price: 85.00, stock: "In Stock (2450)",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80"
  },
  {
    id: "p6", brand: "Molex", name: "KK 254 Header", category: "Connectors",
    desc: "3 Position, 2.54mm Pitch, Vertical Pin Header", price: 4.50, stock: "In Stock (3,200)",
    img: "https://images.unsplash.com/photo-1591405068694-817f73a46618?w=300&q=80"
  }
];

export default function ShopPage() {
  // Connect to global state for filtering
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();

  // The Magic Filter Logic (Applies both Category Sidebar & Search Bar)
  const filteredProducts = PRODUCTS.filter((product) => {
    // 1. Check Category
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    
    // 2. Check Search Bar
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.desc.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="grow max-w-[1600px] w-full mx-auto px-4 md:px-8 py-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-gray-900">Store</span>
          {selectedCategory !== "All Categories" && (
            <>
              <ChevronRightIcon className="h-3 w-3" />
              <span className="text-gray-900 font-medium">{selectedCategory}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          
          {/* Left Sidebar (Now using the global component!) */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28 h-fit">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            
            {/* Header Area */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {selectedCategory === "All Categories" ? "All Components" : selectedCategory}
                </h1>
                <p className="text-gray-500 text-sm">Showing {filteredProducts.length} results</p>
              </div>

              {/* Active Search/Filter Pill */}
              {searchQuery && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-blue-200 p-0.5 rounded-full transition-colors ml-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Product Grid / Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-16 text-center shadow-sm">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any components matching your current search or category filters. 
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-6 rounded transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                {/* Now using the global ProductCard component! */}
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}