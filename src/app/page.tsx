"use client";

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';
import {
  CheckBadgeIcon,
  TruckIcon,
  ShieldCheckIcon,
  UserIcon,
  CpuChipIcon,
  LinkIcon,
  CubeTransparentIcon,
  BoltIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';

// Mock Data for Popular Products
const POPULAR_PRODUCTS = [
  {
    id: "p1", brand: "Arduino", name: "Arduino Uno R3",
    desc: "ATmega328P Microcontroller Board", price: 850.00, stock: "In Stock (50)",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80"
  },
  {
    id: "p2", brand: "Espressif Systems", name: "ESP32 Dev Board",
    desc: "Wi-Fi & Bluetooth MCU", price: 320.00, stock: "In Stock (120)",
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=300&q=80"
  },
  {
    id: "p3", brand: "YAGEO", name: "10K Ohm Resistor",
    desc: "1/4W Through Hole Resistor", price: 0.25, stock: "In Stock (10000)",
    img: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=300&q=80"
  },
  {
    id: "p4", brand: "KEMET", name: "10uF Capacitor",
    desc: "Ceramic Capacitor", price: 2.50, stock: "In Stock (5000)",
    img: "https://images.unsplash.com/photo-1580828343064-fde4cad202d5?w=300&q=80"
  }
];

export default function HomePage() {
  const router = useRouter();
  const { setSelectedCategory } = useStore();

  // Shared function to set global category and route to shop
  const navigateToShop = (category = "All Categories") => {
    setSelectedCategory(category);
    router.push('/shop');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-100">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-8 overflow-hidden">
          
          {/* Hero Section */}
          <div className="bg-[#f8f9fa] rounded-2xl flex flex-col-reverse md:flex-row items-center justify-between p-8 md:p-12 mb-12">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                Find the Right Components, Fast and Easy
              </h1>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigateToShop("All Categories")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors flex items-center gap-2"
                >
                  Shop Now <ArrowLongRightIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigateToShop("All Categories")}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-8 rounded-md transition-colors"
                >
                  New Arrivals
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800" alt="Electronic Components" className="max-w-full h-auto object-cover rounded-xl mix-blend-multiply" />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 border-b border-gray-100 pb-12">
            <div className="flex items-start gap-4">
              <CheckBadgeIcon className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">100% Original</h4>
                <p className="text-xs text-gray-500 mt-1">Authorized distributors</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <TruckIcon className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                <p className="text-xs text-gray-500 mt-1">Reliable & fast dispatch</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">Secure Payments</h4>
                <p className="text-xs text-gray-500 mt-1">100% safe checkout</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <UserIcon className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">Expert Support</h4>
                <p className="text-xs text-gray-500 mt-1">Technical help available</p>
              </div>
            </div>
          </div>

          {/* Shop by Category */}
          <div className="mb-16">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <button 
                onClick={() => navigateToShop("All Categories")} 
                className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 transition-colors"
              >
                View all categories <ArrowLongRightIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Category Grid - Wired to Route to Shop with specific filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div onClick={() => navigateToShop("Semiconductors")} className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all group">
                <CpuChipIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <span className="font-bold text-gray-900 text-sm">Semiconductors</span>
              </div>
              <div onClick={() => navigateToShop("Connectors")} className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all group">
                <LinkIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <span className="font-bold text-gray-900 text-sm">Connectors</span>
              </div>
              <div onClick={() => navigateToShop("Passive Components")} className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all group">
                <CubeTransparentIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <span className="font-bold text-gray-900 text-sm">Passive Components</span>
              </div>
              <div onClick={() => navigateToShop("Power Supplies")} className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all group">
                <BoltIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <span className="font-bold text-gray-900 text-sm">Power Supplies</span>
              </div>
              <div onClick={() => navigateToShop("Test & Measurement")} className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all group">
                <ChartBarIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <span className="font-bold text-gray-900 text-sm">Test & Measurement</span>
              </div>
              <div onClick={() => navigateToShop("Tools")} className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition-all group">
                <WrenchScrewdriverIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <span className="font-bold text-gray-900 text-sm">Tools</span>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
              <button 
                onClick={() => navigateToShop("All Categories")} 
                className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 transition-colors"
              >
                View all products <ArrowLongRightIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {POPULAR_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}