"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function CartDrawer() {
  const router = useRouter();
  const { cartItems, isCartOpen, toggleCart, removeFromCart } = useStore();

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <>
      {/* Dark overlay backdrop when the cart is open */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart} // Closes cart if they click the dark background
      />

      {/* Sliding Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
          <button 
            onClick={toggleCart}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="h-16 w-16 bg-gray-50 rounded-md overflow-hidden shrink-0">
                  {(item.image_url || item.img) && <img src={item.image_url || item.img} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <div className="text-right flex flex-col justify-between items-end h-full">
                  <p className="text-sm font-black text-gray-900">₹{item.price * item.qty}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-xl font-black text-gray-900">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                toggleCart();
                router.push('/checkout');
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}