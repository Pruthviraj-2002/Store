import React from 'react';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  LockClosedIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-black text-blue-700 tracking-tight leading-none">SK Technologies</span>
            </div>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
               Trusted source for electronic components, power supplies, and industrial automation products.
            </p>
          </div>

          {/* Links Column 1: Shop */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Electronic Components</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Power Supplies</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Connectors</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">All Categories</a></li>
            </ul>
          </div>

          {/* Links Column 2: Customer Service */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help & FAQs</a></li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Payment Icons */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SK Technologies. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {/* Minimal SVG placeholders for payment providers */}
            <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">Visa</div>
            <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">MC</div>
            <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">UPI</div>
            <div className="h-6 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">Bank</div>
          </div>
        </div>

      </div>
    </footer>
  );
}