import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  GlobeAsiaAustraliaIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="grow">
        
        {/* Hero Section */}
        <div className="bg-[#f8f9fa] py-20 border-b border-gray-200">
          <div className="max-w-300 mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Empowering India's Innovators.
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              SK Technologies is  premier destination for electronic components. We provide engineers, makers, and businesses with the authentic parts they need to build the future.
            </p>
          </div>
        </div>

        {/* Story & Mission */}
        <div className="max-w-300 mx-auto px-4 md:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Finding reliable, original electronic components used to be a challenge. Counterfeits, long shipping times, and poor customer support slowed down innovation. We started SK Technologies to fix that.
            </p>
            
            <Link href="/shop" className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2 transition-colors">
              Explore our catalog <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <h3 className="text-4xl font-black text-blue-700 mb-2">1M+</h3>
              <p className="text-sm text-blue-900 font-medium">Components in Stock</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <h3 className="text-4xl font-black text-gray-900 mb-2">24h</h3>
              <p className="text-sm text-gray-600 font-medium">Average Dispatch Time</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 text-center mt-8">
              <h3 className="text-4xl font-black text-blue-700 mb-2">100%</h3>
              <p className="text-sm text-blue-900 font-medium">Original Parts</p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-900 text-white py-20">
          <div className="max-w-300 mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose SK Technologies?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">We don't just sell parts; we support your entire development lifecycle with uncompromising standards.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <ShieldCheckIcon className="h-10 w-10 text-blue-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Quality Assured</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Every component is sourced directly from manufacturers or authorized distributors. Zero counterfeits, guaranteed.</p>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <BoltIcon className="h-10 w-10 text-yellow-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Lightning Fast</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Our advanced warehousing ensures that orders placed before 4 PM are dispatched the exact same day.</p>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <UserGroupIcon className="h-10 w-10 text-purple-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Expert Support</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Need a datasheet or technical advice? Our team of in-house engineers is always ready to assist you.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}