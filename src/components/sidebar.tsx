"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Squares2X2Icon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CATEGORY_NAMES } from '@/data/mock';
import { useStore } from '@/store/useStore';

export default function Sidebar() {
  const router = useRouter();
  const { selectedCategory, setSelectedCategory } = useStore();

  // This function sets the global state AND navigates to the shop
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    router.push('/shop');
  };

  return (
    <div className="bg-[#f8f9fa] w-full pb-8 border-r border-gray-200 min-h-screen">
      
      {/* All Categories Reset Button */}
      <button 
        onClick={() => handleCategoryClick("All Categories")}
        className={`w-full text-left font-bold p-4 flex items-center gap-3 transition-colors ${
          selectedCategory === "All Categories" 
            ? "bg-blue-600 text-white" 
            : "bg-blue-50 text-blue-800 hover:bg-blue-100"
        }`}
      >
        <Squares2X2Icon className="h-5 w-5" />
        All Categories
      </button>

      {/* Category List */}
      <ul className="text-sm bg-white">
        {CATEGORY_NAMES.map((name, index) => {
          const isSelected = selectedCategory === name;
          return (
            <li 
              key={index} 
              onClick={() => handleCategoryClick(name)}
              className={`border-b border-gray-100 last:border-0 group cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between py-3.5 px-4">
                <span className={`font-medium transition-colors ${
                  isSelected ? "text-blue-700 font-bold" : "text-gray-700 group-hover:text-blue-600"
                }`}>
                  {name}
                </span>
                <ChevronRightIcon className={`h-4 w-4 transition-colors ${
                  isSelected ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                }`} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}