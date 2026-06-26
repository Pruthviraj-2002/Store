"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { BookmarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product }: { product: any }) {
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if they click the button
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setQuantity(1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col hover:shadow-lg transition-shadow group relative">
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded truncate max-w-30">
          {product.brand}
        </span>
        <button className="text-gray-400 hover:text-blue-600 transition-colors z-10">
          <BookmarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Clickable Area for Product Page */}
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col group">
        <div className="h-40 w-full mb-4 flex items-center justify-center p-2">
          <img 
            src={product.img} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
          />
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.desc}</p>
          
          <p className="text-xs text-green-600 font-medium flex items-center gap-1 mb-3">
            <CheckCircleIcon className="h-4 w-4" />
            {product.stock || "In Stock"}
          </p>
          
          <div className="text-xl font-black text-gray-900 mb-4">
            ₹{product.price.toFixed(2)}
          </div>
        </div>
      </Link>

      {/* Interactive Controls (Kept outside the Link) */}
      <div className="flex items-center gap-2 mt-auto">
        <div className="flex items-center border border-gray-300 rounded overflow-hidden w-24 shrink-0">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-r border-gray-300 transition-colors flex-1 disabled:opacity-50"
            disabled={quantity <= 1}
          >
            −
          </button>
          <input 
            type="text" 
            value={quantity}
            readOnly 
            className="w-8 text-center font-bold text-sm outline-none bg-white text-gray-900" 
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-l border-gray-300 transition-colors flex-1"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className={`flex-1 font-bold py-2 rounded text-sm transition-colors shadow-sm ${
            isAdded 
            ? 'bg-green-600 text-white' 
            : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          {isAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>

    </div>
  );
}