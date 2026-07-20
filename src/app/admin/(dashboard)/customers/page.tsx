"use client";

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { createAdminClient } from '@/utils/supabase/client';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const handleViewCustomer = async (customer: any) => {
    setSelectedCustomer(customer);
    setIsLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?profileId=${customer.id}`);
      const data = await res.json();
      setCustomerOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();

    const supabase = createAdminClient();
    
    // Subscribe to realtime updates on both profiles and orders
    // to recalculate totals when a user places an order or signs up
    const profilesSub = supabase
      .channel('customers-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchCustomers();
      })
      .subscribe();

    const ordersSub = supabase
      .channel('customers-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchCustomers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profilesSub);
      supabase.removeChannel(ordersSub);
    };
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'Admin') {
      alert("Cannot suspend an Admin account.");
      return;
    }

    const action = currentStatus === "Active" ? "suspend" : "activate";
    const previousCustomers = [...customers];
    
    // Optimistic UI update
    setCustomers(customers.map(cust => 
      cust.id === id ? { ...cust, status: action === 'suspend' ? 'Suspended' : 'Active' } : cust
    ));

    try {
      const res = await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error: any) {
      alert(error.message);
      // Revert on failure
      setCustomers(previousCustomers);
    }
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
                <th className="px-6 py-4">Cancelled</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
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
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{customer.registered}</td>
                    <td className="px-6 py-4 font-medium">{customer.totalOrders}</td>
                    <td className="px-6 py-4 font-medium text-red-500">{customer.cancelledOrders > 0 ? customer.cancelledOrders : '-'}</td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      ₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        customer.status === 'Admin' ? 'bg-purple-100 text-purple-800' :
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
                        <button 
                          onClick={() => handleViewCustomer(customer)}
                          className="text-gray-400 hover:text-gray-900 transition-colors p-1" 
                          title="View Profile"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        
                        <button 
                          onClick={() => handleToggleStatus(customer.id, customer.status)}
                          className={`p-1 transition-colors ${customer.status === 'Active' || customer.status === 'Admin' ? 'text-gray-400 hover:text-red-600' : 'text-red-500 hover:text-green-600'}`} 
                          title={(customer.status === 'Active' || customer.status === 'Admin') ? 'Suspend Account' : 'Activate Account'}
                        >
                          {(customer.status === 'Active' || customer.status === 'Admin') ? <NoSymbolIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
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

      {/* Customer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Customer Profile</h3>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{selectedCustomer.name}</h4>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                  <p className="font-semibold text-gray-900">{selectedCustomer.status}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Registered</p>
                  <p className="font-semibold text-gray-900">{selectedCustomer.registered}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="font-semibold text-gray-900">{selectedCustomer.totalOrders} <span className="text-gray-400 font-normal text-sm">({selectedCustomer.cancelledOrders} cancelled)</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Lifetime Value</p>
                  <p className="font-bold text-green-600">₹{selectedCustomer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* Individual Orders List */}
              <div className="mt-6">
                <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 mb-3">Order History</h4>
                {isLoadingOrders ? (
                  <div className="text-center py-4 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div> Loading orders...
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No orders found.</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {customerOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">#{order.order_number || order.id.split('-')[0]}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${['cancelled', 'returned', 'refunded'].includes(order.status.toLowerCase()) ? 'text-red-500' : 'text-green-600'}`}>
                            {order.status}
                          </p>
                          <p className="text-sm font-bold text-gray-900">₹{Number(order.total || order.grand_total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}