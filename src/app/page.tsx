"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
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

// Helper to map dynamic categories to icons
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('semi') || lowerName.includes('chip')) return CpuChipIcon;
  if (lowerName.includes('connect')) return LinkIcon;
  if (lowerName.includes('power')) return BoltIcon;
  if (lowerName.includes('test') || lowerName.includes('measure')) return ChartBarIcon;
  if (lowerName.includes('tool')) return WrenchScrewdriverIcon;
  return CubeTransparentIcon;
};

export default function HomePage() {
  const router = useRouter();
  const { setSelectedCategory } = useStore();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [popularProducts, setPopularProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ]);
        
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        
        if (catData.categories) setCategories(catData.categories.slice(0, 6)); // Top 6 for grid
        
        const productsArray = Array.isArray(prodData) ? prodData : prodData.products || [];
        setPopularProducts(productsArray.slice(0, 8)); // Grab 8 for a nice 2-row grid
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const navigateToShop = (category = "All Categories") => {
    setSelectedCategory(category);
    router.push('/shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />

      {/* --- 1. THE HALO EFFECT: IMMERSIVE HERO SECTION --- */}
      <div 
        className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden isolate bg-gray-950 bg-cover bg-center"
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-[2px]" />

        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Tech Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Next-Gen Components
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tight mb-6 max-w-4xl">
            Powering the Future of Electronics
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-10 max-w-2xl font-medium">
            Discover premium, industrial-grade components for your next breakthrough project. Fast, reliable, and authentic.
          </p>
          <button 
            onClick={() => navigateToShop("All Categories")}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-black rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient" />
            <span className="relative">Explore Catalog</span>
            <ArrowLongRightIcon className="relative h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- 2. FLOATING TRUST BADGES --- */}
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 relative z-20 -mt-16 mb-12">
        <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <CheckBadgeIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm md:text-base">100% Original</h4>
              <p className="text-xs text-gray-500 mt-1 font-medium">Authorized distributors</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <TruckIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm md:text-base">Fast Delivery</h4>
              <p className="text-xs text-gray-500 mt-1 font-medium">Reliable & fast dispatch</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm md:text-base">Secure Payments</h4>
              <p className="text-xs text-gray-500 mt-1 font-medium">100% safe checkout</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm md:text-base">Expert Support</h4>
              <p className="text-xs text-gray-500 mt-1 font-medium">Technical help available</p>
            </div>
          </div>
        </div>
      </div>



      {/* --- 4. VON RESTORFF EFFECT: POPULAR PRODUCTS ON DARKER BG --- */}
      <div className="bg-[#f3f4f6] py-12 md:py-16 border-t border-gray-200">
        <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Trending Now</h2>
              <p className="text-gray-500 mt-2 font-medium text-base md:text-lg">Top components chosen by our engineers.</p>
            </div>
            <button 
              onClick={() => navigateToShop("All Categories")} 
              className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-2 transition-colors group hidden sm:flex"
            >
              View all products <ArrowLongRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-4 h-80 bg-white animate-pulse shadow-sm border border-gray-100"></div>
              ))
            ) : popularProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => navigateToShop("All Categories")} 
            className="w-full mt-8 py-4 text-blue-600 border border-blue-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors sm:hidden"
          >
            View all products <ArrowLongRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

    </div>
  );
}