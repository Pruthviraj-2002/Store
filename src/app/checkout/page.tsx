"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';
import { 
  CheckCircleIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useStore();
  
  // States
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  // Redirect if cart is empty and not on success screen
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      router.push('/cart');
    }
  }, [cartItems.length, isSuccess, router]);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100 animate-fade-in-up">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8">
              Thank you, {formData.firstName}. We've received your order and will begin processing it immediately. Your order number is <span className="font-bold text-gray-900">#SK-{Math.floor(100000 + Math.random() * 900000)}</span>.
            </p>
            <Link 
              href="/track-order" 
              className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm mb-3"
            >
              Track Order
            </Link>
            <Link 
              href="/shop" 
              className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // --- CHECKOUT SCREEN ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
            <LockClosedIcon className="h-4 w-4" /> Secure 256-bit SSL Encryption
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact & Shipping */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input type="email" name="email" required onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">First Name</label>
                    <input type="text" name="firstName" required onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Last Name</label>
                    <input type="text" name="lastName" required onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Address</label>
                  <input type="text" name="address" required placeholder="Street address, company name, etc." onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">City</label>
                    <input type="text" name="city" required onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">State</label>
                    <select name="state" required onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white">
                      <option value="">Select State</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">PIN Code</label>
                    <input type="text" name="pincode" required maxLength={6} onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone</label>
                    <input type="tel" name="phone" required onChange={handleInputChange} className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-3">
                
                {/* UPI Option */}
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-600" />
                    <span className="font-bold text-gray-900">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                  <QrCodeIcon className="h-6 w-6 text-gray-500" />
                </label>

                {/* Card Option */}
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-600" />
                    <span className="font-bold text-gray-900">Credit / Debit Card</span>
                  </div>
                  <CreditCardIcon className="h-6 w-6 text-gray-500" />
                </label>

                {/* Net Banking Option */}
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-600" />
                    <span className="font-bold text-gray-900">Net Banking</span>
                  </div>
                  <BuildingLibraryIcon className="h-6 w-6 text-gray-500" />
                </label>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Items List */}
              <div className="max-h-75 overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-50 border border-gray-200 rounded p-1 shrink-0 flex items-center justify-center">
                      <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (18% GST)</span>
                  <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-8">
                <div>
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <p className="text-xs text-gray-500">Including taxes</p>
                </div>
                <span className="text-3xl font-black text-gray-900">₹{total.toFixed(2)}</span>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Secure Payment...
                  </>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                Payments processed securely.
              </div>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}