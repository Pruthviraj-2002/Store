"use client";

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// Mock Database for Customers
const INITIAL_CUSTOMERS = [
  { 
    id: "CUST-001", 
    name: "Rahul Sharma", 
    email: "rahul.s@example.com",
    registered: "2026-01-15",
    totalOrders: 12,
    totalSpent: 45000.00,
    status: "Active" 
  },
  { 
    id: "CUST-002", 
    name: "TechNova Solutions", 
    email: "procurement@technova.in",
    registered: "2026-03-22",
    totalOrders: 4,
    totalSpent: 125000.00,
    status: "Active" 
  },
  { 
    id: "CUST-003", 
    name: "Anita Desai", 
    email: "anita.d@example.com",
    registered: "2026-05-10",
    totalOrders: 1,
    totalSpent: 850.00,
    status: "Active" 
  },
  { 
    id: "CUST-004", 
    name: "Kiran Kumar", 
    email: "kiran99@example.com",
    registered: "2025-11-05",
    totalOrders: 8,
    totalSpent: 12400.50,
    status: "Suspended" 
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");

  // Handler to toggle account status
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setCustomers(customers.map(cust => 
      cust.id === id ? { ...cust, status: newStatus } : cust
    ));
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage user accounts and view purchase history.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No customers found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{customer.registered}</td>
                    <td className="px-6 py-4 font-medium">{customer.totalOrders}</td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      ₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`mailto:${customer.email}`} className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Email Customer">
                          <EnvelopeIcon className="h-5 w-5" />
                        </a>
                        <button className="text-gray-400 hover:text-gray-900 transition-colors p-1" title="View Profile">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        
                        <button 
                          onClick={() => handleToggleStatus(customer.id, customer.status)}
                          className={`p-1 transition-colors ${customer.status === 'Active' ? 'text-gray-400 hover:text-red-600' : 'text-red-500 hover:text-green-600'}`} 
                          title={customer.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {customer.status === 'Active' ? <NoSymbolIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}