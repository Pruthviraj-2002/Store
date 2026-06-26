"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Added for search routing
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  ClipboardDocumentListIcon, 
  ShoppingCartIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { CATEGORY_NAMES } from '@/data/mock';

export default function Navbar() {
  const router = useRouter(); // Initialize the Next.js router

  // Zustand State
  const cartTotalItems = useStore((state) => state.cartTotalItems);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const selectedCategory = useStore((state) => state.selectedCategory);

  // Local State for the Dropdown Menu
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Search Functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    if (searchQuery.trim()) {
      // Redirects to shop page with search query in URL
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/shop`);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      
      {/* Top Utility Bar */}
      <div className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 py-1.5 px-4 md:px-8 flex justify-end">
        <div className="flex gap-4">
          <Link href="/help" className="hover:text-blue-600 transition-colors">Help</Link>
          <Link href="/track-order" className="hover:text-blue-600 transition-colors">Track Order</Link>
          <Link href="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link>
          <Link href="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link>
          <span className="font-medium text-gray-700 pl-4 border-l border-gray-300">EN / INR</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1600px] mx-auto h-20 px-4 md:px-8 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer hover:opacity-90 transition-opacity">
          <span className="text-2xl font-black text-blue-700 tracking-tight leading-none">SK Technologies</span>
        </Link>

        {/* Global Search - Converted to a <form> for functionality */}
        <form 
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-3xl items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 shadow-sm relative"
        >
          
          {/* Custom Dropdown Trigger */}
          <div className="relative shrink-0 border-r border-gray-300 h-full">
            <button 
              type="button"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="bg-gray-50 text-sm text-gray-700 px-4 py-3 flex items-center justify-between min-w-40 hover:bg-gray-100 transition-colors h-full rounded-l-md"
            >
              <span className="truncate">{selectedCategory}</span>
              <ChevronDownIcon className={`h-4 w-4 text-gray-500 ml-2 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Bulletproof Dropdown with Invisible Overlay */}
            {isCategoryMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-90" 
                  onClick={() => setIsCategoryMenuOpen(false)}
                ></div>

                <div className="absolute top-[110%] left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-xl z-100 py-2 flex flex-col">
                  <button 
                    type="button"
                    className={`text-left px-4 py-2.5 text-sm hover:bg-blue-600 hover:text-white transition-colors ${selectedCategory === "All Categories" ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                    onClick={() => { setSelectedCategory("All Categories"); setIsCategoryMenuOpen(false); }}
                  >
                    All Categories
                  </button>
                  {CATEGORY_NAMES.map((cat) => (
                    <button 
                      type="button"
                      key={cat} 
                      className={`text-left px-4 py-2.5 text-sm hover:bg-blue-600 hover:text-white transition-colors ${selectedCategory === cat ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                      onClick={() => { setSelectedCategory(cat); setIsCategoryMenuOpen(false); }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <input 
            type="text" 
            placeholder="Search by part number, product name or brand..." 
            className="grow px-4 py-3 outline-none text-sm text-gray-800 bg-transparent relative z-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Changed to type="submit" so hitting Enter works */}
          <button type="submit" className="shrink-0 bg-blue-600 text-white px-8 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium h-full rounded-r-md relative z-10">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </button>
        </form>

        {/* Account & Cart Actions */}
        <div className="flex items-center gap-6">
          
          {/* Sign In - Connected to /login */}
          <Link href="/login" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <UserIcon className="h-6 w-6 text-gray-600" />
            <div className="hidden xl:block text-left text-sm">
              <div className="font-bold text-gray-900 leading-none">Sign In</div>
              <div className="text-gray-500 text-xs mt-0.5">My Account</div>
            </div>
          </Link>
          
          {/* My Orders - Connected to /track-order */}
          <Link href="/track-order" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <ClipboardDocumentListIcon className="h-6 w-6 text-gray-600" />
            <div className="hidden xl:block text-left text-sm">
              <div className="font-bold text-gray-900 leading-none">My Orders</div>
              <div className="text-gray-500 text-xs mt-0.5">Track & Return</div>
            </div>
          </Link>
          
          {/* Cart Link */}
          <Link 
            href="/cart"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors relative"
          >
            <ShoppingCartIcon className="h-7 w-7 text-gray-800" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-800 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                {cartTotalItems > 99 ? '99+' : cartTotalItems}
              </span>
            )}
            <div className="hidden xl:block text-left text-sm ml-1">
              <div className="font-bold text-gray-900 leading-none">Cart</div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}