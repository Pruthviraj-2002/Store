"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-950 text-gray-300 py-16 mt-auto border-t border-gray-900">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Section */}
        <div>
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-black text-blue-500 tracking-tight leading-none">SK <span className="text-white">Tech</span></span>
          </Link>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Your trusted destination for electronic components, development boards, and professional tools. Building the future, one circuit at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-5 uppercase text-xs tracking-wider">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Shop All Products</Link></li>
            <li><Link href="/track-order" className="hover:text-blue-400 transition-colors">Track Order</Link></li>
            <li><Link href="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-bold mb-5 uppercase text-xs tracking-wider">Company</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about-us" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Tech Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold mb-5 uppercase text-xs tracking-wider">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/returns" className="hover:text-blue-400 transition-colors">Return Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} SK Store. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 font-medium tracking-wide">
          <span>CURRENCY: INR</span>
          <span>|</span>
          <span>LANGUAGE: ENGLISH</span>
        </div>
      </div>
    </footer>
  );
}