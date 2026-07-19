"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingCartIcon, ArrowsPointingOutIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function ProductQuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart, showToast } = useStore();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const imageUrl = product.image_url || product.img || product.images?.[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80';
  const price = Number(product.price).toFixed(2);
  const isAvailable = product.stock > 0 || typeof product.stock === 'string' && product.stock.toLowerCase().includes('stock');

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      desc: product.desc || product.description || '',
      price: Number(product.price) || 0,
      stock: product.stock > 0 ? `In stock (${product.stock})` : 'In stock',
      img: imageUrl,
    };
    addToCart(cartItem, 1);
    setQuickViewProduct(null); // Close modal on add
    showToast(`${product.name} added to cart!`, 'success');
  };

  const productUrl = `/product/${product.slug || product.id}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Futuristic Glassmorphic Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          style={{ perspective: 1000 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-gray-100"
        >
          {/* Close Button - Futuristic Floating */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 p-2.5 bg-white/50 hover:bg-white backdrop-blur-md text-gray-900 rounded-full transition-all duration-300 z-10 shadow-sm border border-gray-200 hover:rotate-90 hover:scale-110"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Left: Image Area (Smart Future Grid) */}
          <div className="w-full md:w-1/2 bg-[#fafafa] flex items-center justify-center p-8 relative overflow-hidden">
            {/* Tech Dotted Background */}
            <div className="absolute inset-0" 
                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            
            {/* Soft white glow behind image to prevent grid bleed-through */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_70%)] z-0"></div>
            
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              src={imageUrl}
              alt={product.name}
              className="max-h-[300px] md:max-h-[400px] w-full object-contain mix-blend-multiply relative z-10 drop-shadow-2xl"
            />
          </div>

          {/* Right: Details Area */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto bg-white">
            <div className="mb-8 flex-grow">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  <SparklesIcon className="h-3 w-3 text-yellow-400" />
                  {product.category || product.brand || 'Component'}
                </div>
                
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-black text-gray-900 mb-3 leading-tight tracking-tight">
                {product.name}
              </h2>
              
              <div className="text-xs font-mono font-bold text-gray-400 mb-6 flex items-center gap-2">
                <span>SKU: {product.mfrPartNo || product.id.slice(0,8).toUpperCase()}</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6 border-b border-gray-100 pb-6">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{price}</span>
                <span className="text-sm font-bold text-gray-400">/ unit</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                {product.description || product.desc || 'Premium quality component designed for precision and durability. Engineered for next-generation smart systems and high-performance electronics.'}
              </p>
            </div>

            {/* Smart Future Buttons */}
            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:-translate-y-1 hover:bg-black group"
              >
                <ShoppingCartIcon className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                <span>Add to Cart</span>
              </button>
              
              <Link 
                href={productUrl}
                onClick={() => setQuickViewProduct(null)}
                className="w-full bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <ArrowsPointingOutIcon className="h-4 w-4" /> 
                <span>View Full Specifications</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
