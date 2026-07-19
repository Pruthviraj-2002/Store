"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/client';
import { 
  ChartPieIcon, 
  CubeIcon, 
  TruckIcon, 
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartPieIcon },
    { name: 'Inventory', href: '/admin/inventory', icon: CubeIcon },
    { name: 'Orders & Dispatch', href: '/admin/orders', icon: TruckIcon },
    { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 fixed h-full z-20">
        <div className="h-16 flex items-center px-6 bg-gray-950 border-b border-gray-800">
          <span className="text-xl font-black tracking-tight text-white">
            SK <span className="text-blue-500">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
            Back to Store
          </Link>
          <button 
            onClick={async () => {
              const supabase = createAdminClient();
              await supabase.auth.signOut();
              window.location.href = '/admin/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 transition-colors"
          >
            <Cog6ToothIcon className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900">Command Center</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}