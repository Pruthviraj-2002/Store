"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore, CartItem } from '@/store/useStore';
import { 
  ChevronLeftIcon, 
  TrashIcon, 
  InformationCircleIcon, 
  BookmarkIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  UserIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

export default function CartPage() {
  const router = useRouter();
  
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useStore();

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  // Handle routing to the checkout page
  const handleCheckout = () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="grow max-w-350 w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Cart <span className="text-gray-500 font-normal text-lg">({cartItems.length} items)</span>
          </h1>
          <Link href="/shop" className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition-colors">
            <ChevronLeftIcon className="h-4 w-4 stroke-[3px]" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-bold text-gray-900 mb-2">Your cart is empty.</p>
                    <p className="mb-6">Looks like you haven't added any components yet.</p>
                    <Link href="/shop" className="bg-blue-600 text-white px-6 py-2.5 rounded font-bold hover:bg-blue-700 transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item: CartItem) => {
                    const imageSrc = item.img || item.image_url || '';
                    return (
                    <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Image & Details */}
                      <div className="col-span-1 md:col-span-6 flex gap-4">
                        <div className="h-20 w-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center shrink-0 p-1">
                          {imageSrc ? (
                            <img src={imageSrc} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          ) : (
                            <ShoppingCartIcon className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc || item.stock || 'Premium component'}</p>
                          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            {item.stock || 'In stock'}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-1 md:col-span-2 text-left md:text-center font-bold text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-r border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <input 
                            type="text" 
                            value={item.qty} 
                            readOnly 
                            className="w-10 text-center font-bold text-sm outline-none bg-white" 
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-l border-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                        <div className="font-bold text-gray-900 text-lg">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>

              {/* Cart Actions */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button 
                    onClick={clearCart}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium text-sm"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Shipping <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                  </span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="flex items-center gap-1">
                    Estimated Tax (18% GST) <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                  </span>
                  <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>

                <div className="pt-2 flex justify-between items-start">
                  <div>
                    <span className="text-lg font-bold text-gray-900">Order Total</span>
                    <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
                  </div>
                  <span className="text-2xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
                <ChevronLeftIcon className="h-4 w-4 rotate-180 stroke-[3px]" />
              </button>

              <button className="w-full mt-3 bg-white border border-gray-300 hover:bg-gray-50 text-blue-700 font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2">
                <BookmarkIcon className="h-5 w-5" />
                Save Cart for Later
              </button>
            </div>

            {/* Sidebar Trust Badges */}
            <div className="space-y-4 px-2">
              <div className="flex gap-4 items-start">
                <ShieldCheckIcon className="h-6 w-6 text-gray-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Secure Payments</h4>
                  <p className="text-xs text-gray-500 mt-0.5">100% secure transactions</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <TruckIcon className="h-6 w-6 text-gray-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Fast Delivery</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Order within 4h 32m for same day dispatch</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <ArrowPathIcon className="h-6 w-6 text-gray-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-500 mt-0.5">30 days return policy</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-16 pt-10 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <ShieldCheckIcon className="h-8 w-8 text-gray-600 shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900">100% Original Products</h4>
              <p className="text-sm text-gray-500 mt-1">Sourced from authorized distributors</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <TruckIcon className="h-8 w-8 text-gray-600 shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900">Fast & Secure Delivery</h4>
              <p className="text-sm text-gray-500 mt-1">Reliable logistics for your projects</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <BookmarkIcon className="h-8 w-8 text-gray-600 shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900">Secure Payments</h4>
              <p className="text-sm text-gray-500 mt-1">Multiple secure payment options</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <UserIcon className="h-8 w-8 text-gray-600 shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900">Expert Support</h4>
              <p className="text-sm text-gray-500 mt-1">Get help from our experts</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}