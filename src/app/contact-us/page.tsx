"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="grow max-w-300 w-full mx-auto px-4 md:px-8 py-12 md:py-20">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Whether you have a question about a specific component, need a bulk quote, or require technical support, our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Headquarters</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A, 11-146, Opposite IDPL Colony<br />
                Patwari Enclave, Adarsh Nagar<br />
                Balanagar, Hyderabad<br />
                Telangana 500037
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <PhoneIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-500 text-sm mb-1">+91 1800-123-4567</p>
              <p className="text-xs text-gray-400">Mon-Sat from 9am to 6pm</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-500 text-sm mb-1">support@sktechnologies.in</p>
              <p className="text-xs text-gray-400">We aim to reply within 2 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
              
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 animate-fade-in-up">
                  <CheckCircleIcon className="h-20 w-20 text-green-500 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-500 max-w-md">Thank you for reaching out. One of our technical representatives will get back to you shortly.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 bg-blue-50 text-blue-700 font-bold py-2 px-6 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Name</label>
                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-gray-900" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                        <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-gray-900" placeholder="john@company.com" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject</label>
                      <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-gray-900 appearance-none">
                        <option value="">Select an inquiry type</option>
                        <option value="technical">Technical Support</option>
                        <option value="sales">Bulk Order / Sales Quote</option>
                        <option value="order">Order Tracking</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Message</label>
                      <textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-gray-900 resize-none" placeholder="How can we help you today?"></textarea>
                    </div>

                    <button type="submit" className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-sm">
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}