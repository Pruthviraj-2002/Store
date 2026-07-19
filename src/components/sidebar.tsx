"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Squares2X2Icon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';

export default function Sidebar() {
  const router = useRouter();
  const { selectedCategory, setSelectedCategory } = useStore();
  const [categoryNames, setCategoryNames] = React.useState<string[]>([]);

  React.useEffect(() => {
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

  // This function sets the global state AND navigates to the shop
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    router.push('/shop');
  };

  return (
    <div className="bg-transparent w-full pb-8">
      
      {/* Category List */}
      <ul className="text-sm bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        {/* All Categories Button */}
        <li>
          <button 
            onClick={() => handleCategoryClick("All Categories")}
            className={`w-full text-left font-bold py-4 px-5 flex items-center justify-between transition-all ${
              selectedCategory === "All Categories" 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                : "text-gray-900 hover:bg-gray-50 border-l-4 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Squares2X2Icon className={`h-5 w-5 ${selectedCategory === "All Categories" ? "text-blue-600" : "text-gray-400"}`} />
              All Categories
            </div>
            <ChevronRightIcon className={`h-4 w-4 ${selectedCategory === "All Categories" ? "text-blue-600" : "text-gray-400"}`} />
          </button>
        </li>

        {categoryNames.map((name, index) => {
          const isSelected = selectedCategory === name;
          return (
            <li 
              key={index} 
              onClick={() => handleCategoryClick(name)}
              className={`border-t border-gray-100 group cursor-pointer transition-all ${
                isSelected ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-50 border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between py-3.5 px-5">
                <span className={`font-medium transition-colors ${
                  isSelected ? "text-blue-700 font-bold" : "text-gray-600 group-hover:text-gray-900"
                }`}>
                  {name}
                </span>
                <ChevronRightIcon className={`h-4 w-4 transition-colors ${
                  isSelected ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400"
                }`} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}