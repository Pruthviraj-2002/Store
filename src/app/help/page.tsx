"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  ArrowPathIcon, 
  ChatBubbleLeftRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Mock FAQ Data
const FAQS = [
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you will receive an email with a tracking link. You can also view real-time tracking from the 'My Orders' section in your account dashboard."
  },
  {
    question: "What is your return policy for electronic components?",
    answer: "We offer a 30-day return policy for unopened, un-soldered components in their original anti-static packaging. Please note that custom-cut cables and programmed microcontrollers are non-refundable."
  },
  {
    question: "Do you offer technical support for components?",
    answer: "Yes! Our startup is built by engineers, for engineers. If you are stuck on a schematic or need a datasheet, click 'Talk to Support' on the homepage or use the Technical Support portal below."
  },
  {
    question: "Can I request a quote for bulk / wholesale orders?",
    answer: "Absolutely. If you are ordering more than 500 units of a specific part, please contact our B2B sales team directly for volume pricing discounts."
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First one open by default

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Help Header & Search Banner */}
        <section className="bg-blue-700 text-white py-16 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">How can we help?</h1>
            <p className="text-blue-100 text-lg mb-8">Search our knowledge base or browse categories below.</p>
            
            {/* Search Bar */}
            <div className="relative flex items-center max-w-2xl mx-auto shadow-xl rounded-md overflow-hidden focus-within:ring-4 focus-within:ring-blue-400 transition-all">
              <div className="absolute left-4 text-gray-400">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </div>
              <input 
                type="text" 
                placeholder="Search for articles, tracking info, or return policies..." 
                className="w-full pl-14 pr-4 py-4 text-gray-900 outline-none text-lg bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-gray-900 text-white px-8 py-4 font-bold hover:bg-black transition-colors">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="max-w-300 mx-auto px-4 md:px-8 py-12 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TruckIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track & Manage Orders</h3>
              <p className="text-gray-500 text-sm">Check shipping status, view invoices, or modify an existing order.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ArrowPathIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Returns & Refunds</h3>
              <p className="text-gray-500 text-sm">Start a return process, check eligibility, or print a shipping label.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h3>
              <p className="text-gray-500 text-sm">Get help with component specs, datasheets, or prototyping advice.</p>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-200 mx-auto px-4 md:px-8 py-12 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Can't find the answer you're looking for? Reach out to our support team.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
              >
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-gray-900 text-left">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Accordion Content */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}