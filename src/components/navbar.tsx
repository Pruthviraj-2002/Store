"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { supabaseBrowser } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();

  // Zustand State
  const cartTotalItems = useStore((state) => state.cartItems.reduce((total, item) => total + item.qty, 0));
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const showToast = useStore((state) => state.showToast);

  // Local State
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setCategoryNames(data.categories.map((c: any) => c.name));
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      }
    }
    fetchCategories();
  }, []);

  // Search Functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/shop`);
    }
  };

  const handleLogout = async () => {
    if (supabaseBrowser) {
      await supabaseBrowser.auth.signOut();
      setUser(null);
      setIsProfileMenuOpen(false);
      showToast("Logged out successfully", "success");
      router.push('/');
    }
  };

  const navigateToCategory = (cat: string) => {
    setSelectedCategory(cat);
    router.push('/shop');
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm flex flex-col">
      {/* Main Header */}
      <div className="max-w-[1600px] w-full mx-auto h-20 px-4 md:px-8 flex items-center justify-between gap-12">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center cursor-pointer hover:opacity-90 transition-opacity">
          <span className="text-2xl font-black text-blue-700 tracking-tight leading-none">SK <span className="text-gray-900">Store</span></span>
        </Link>

        {/* Clean Global Search */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-2xl items-center border border-gray-300 rounded-full bg-gray-50 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-inner relative overflow-hidden"
        >
          <div className="pl-5 pr-2 py-3 text-gray-400">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search by part number, product name or brand..."
            className="grow py-3 pr-4 outline-none text-sm text-gray-800 bg-transparent w-full font-medium placeholder:font-normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hidden">Search</button>
        </form>

        {/* Account & Cart Actions */}
        <div className="flex items-center gap-4 shrink-0">

          {/* User Profile Dropdown */}
          <div className="relative group">
            {user ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm border border-blue-200">
                  {user.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left text-sm mr-2">
                  <div className="font-bold text-gray-900 leading-none truncate max-w-[120px]">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">My Account</div>
                </div>
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center border border-gray-200">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="hidden xl:block text-left text-sm mr-2">
                  <div className="font-bold text-gray-900 leading-none">Sign In</div>
                  <div className="text-gray-500 text-xs mt-0.5">My Account</div>
                </div>
              </Link>
            )}

            {/* Profile Menu Popup */}
            {user && isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                <div className="absolute right-0 top-[110%] w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100"
                  >
                    <UserIcon className="h-5 w-5" />
                    My Profile
                  </Link>
                  <Link
                    href="/my-orders"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    Track Order
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Cart Button */}
          <Link
            href="/cart"
            className="flex items-center gap-3 bg-gray-900 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative group"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <div className="text-sm font-bold hidden sm:block">Cart</div>

            {/* High Visibility Badge */}
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                {cartTotalItems > 99 ? '99+' : cartTotalItems}
              </span>
            )}
          </Link>

        </div>
      </div>

      <div className="border-t border-gray-100 bg-white hidden md:block">
        <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 flex items-center justify-center gap-8 lg:gap-12">
          <button
            onClick={() => navigateToCategory("All Categories")}
            className={`py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              selectedCategory === "All Categories" 
                ? "text-blue-700 border-blue-600" 
                : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600"
            }`}
          >
            All Categories
          </button>
          {categoryNames.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => navigateToCategory(cat)}
              className={`py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                selectedCategory === cat
                  ? "text-blue-700 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
          
          {categoryNames.length > 6 && (
            <div 
              className="relative group"
              onMouseEnter={() => setIsMoreMenuOpen(true)}
              onMouseLeave={() => setIsMoreMenuOpen(false)}
            >
              <button className="flex items-center gap-1 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-colors whitespace-nowrap">
                More
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isMoreMenuOpen && (
                <div className="absolute top-full right-0 w-56 bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {categoryNames.slice(6).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigateToCategory(cat);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${
                        selectedCategory === cat
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-l-4 border-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}