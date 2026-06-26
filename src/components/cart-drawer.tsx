"use client";

import React from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';

export default function CartDrawer() {
  // Pulling state and actions from your Zustand store
  const isCartOpen = useStore((state) => state.isCartOpen);
  const toggleCart = useStore((state) => state.toggleCart);
  
  // Hardcoded visual mock data for now. 
  // Later, we will replace this with real items from useStore.
  const cartItems = [
    { 
      id: "p1", 
      name: "Arduino Uno R3", 
      price: 850.00, 
      qty: 1, 
      image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=200&q=80" 
    },
    { 
      id: "p2", 
      name: "ESP32 DevKitC", 
      price: 320.00, 
      qty: 2, 
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80" 
    }
  ];

  return (
    <>
      {/* 1. Dark Background Overlay */}
      {/* Clicking this will close the cart */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-9998 backdrop-blur-sm transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* 2. The Sliding Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-white z-9999 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">Shopping Cart</h2>
          <button 
            onClick={toggleCart} 
            className="text-gray-400 hover:text-blue-600 transition-colors p-2 -mr-2 rounded-full hover:bg-blue-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-5 bg-white group">
              {/* Product Image */}
              <div className="h-24 w-24 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-2">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.qty}</p>
                </div>
                
                <div className="flex items-end justify-between mt-2">
                  <span className="font-black text-lg text-blue-700">₹{(item.price * item.qty).toFixed(2)}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-1 font-medium">
                    <TrashIcon className="h-4 w-4" />
                    <span className="hidden group-hover:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Checkout Action */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-2">
            <p>Subtotal</p>
            <p>₹1,490.00</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
          
          <button className="w-full bg-blue-600 text-white px-6 py-4 rounded-md font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            Proceed to Checkout
          </button>
          
          <button 
            onClick={toggleCart}
            className="w-full text-center mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}