import React from 'react';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  LockClosedIcon, 
  PhoneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// FIXED: Correct Next.js Link import
import Link from 'next/link'; 

export default function Hero() {
  return (
    <div className="w-full mb-8">
      {/* Main Banner Area */}
      <div className="bg-[#f4f6f8] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden h-100">
        
        {/* Left Side: Text and CTA */}
        <div className="relative z-20 w-full md:w-3/5">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
            Find the Right Components,<br /> Fast and Easy
          </h1>
          
          {/* Updated Startup CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/shop" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 rounded-md font-bold transition-colors shadow-sm active:scale-[0.98] flex items-center gap-2">
              Shop Now <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/new-arrivals" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-3.5 rounded-md font-bold transition-colors shadow-sm active:scale-[0.98]">
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Right Side: The Background Image */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 z-10">
          <div className="absolute inset-0 bg-linear-to-r from-[#f4f6f8] via-transparent to-transparent z-10 pointer-events-none"></div>
          <img 
            src="/bg.png" 
            alt="Electronic Components Background" 
            className="w-full h-full object-cover mix-blend-multiply opacity-95"
          />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">100% Original</h4>
            <p className="text-xs text-gray-500 mt-0.5">Authorized distributors</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
          <TruckIcon className="h-8 w-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">Delivery</h4>
            <p className="text-xs text-gray-500 mt-0.5">Fast & reliable dispatch</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
          <LockClosedIcon className="h-8 w-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">Secure Payments</h4>
            <p className="text-xs text-gray-500 mt-0.5">100% safe checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
          <PhoneIcon className="h-8 w-8 text-blue-600  shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">Expert Support</h4>
            <p className="text-xs text-gray-500 mt-0.5">Technical help available</p>
          </div>
        </div>
      </div>
    </div>
  );
}