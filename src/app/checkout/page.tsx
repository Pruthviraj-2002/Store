"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';
import { supabaseBrowser } from '@/lib/supabase';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  notes: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart, user } = useStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    const supabase = supabaseBrowser;
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user!.id)
      .order('is_default', { ascending: false });

    if (!error && data && data.length > 0) {
      setSavedAddresses(data);
      // Auto-select the default or the first one
      const defaultAddr = data[0];
      handleSelectAddress(defaultAddr);
    }
    setIsLoadingAddresses(false);
  };

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    
    setFormData(prev => ({
      ...prev,
      firstName: addr.first_name || '',
      lastName: addr.last_name || '',
      phone: addr.phone,
      address: `${addr.address_line1}${addr.address_line2 ? ', ' + addr.address_line2 : ''}, ${addr.city}, ${addr.state} ${addr.postal_code}, ${addr.country}`
    }));
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const tax = subtotal * 0.18; // 18% GST
  const cartTotal = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage(null);

    try {
      const orderPayload = {
        customerEmail: formData.email,
        profileId: user?.id,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          notes: formData.notes
        },
        subtotal: Number(subtotal.toFixed(2)),
        gst_amount: Number(tax.toFixed(2)),
        totalAmount: Number(cartTotal.toFixed(2)),
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
        }))
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to place order');
      }

      clearCart();
      router.push(`/track-order?orderId=${encodeURIComponent(result.orderId || 'UNKNOWN')}&email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to place order' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-24 w-full grow">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button onClick={() => router.push('/shop')} className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition-colors">
              Return to Shop
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t-2 border-gray-100 space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Taxes (18% GST)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Details</h2>

                {user && (
                  <div className="mb-6">
                    {isLoadingAddresses ? (
                      <div className="text-sm text-gray-500">Loading saved addresses...</div>
                    ) : savedAddresses.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-700">Select a saved address:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {savedAddresses.map(addr => (
                            <div 
                              key={addr.id}
                              onClick={() => handleSelectAddress(addr)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all relative ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
                            >
                              {selectedAddressId === addr.id && (
                                <CheckCircleIcon className="absolute top-4 right-4 h-5 w-5 text-blue-600" />
                              )}
                              <p className="font-bold text-gray-900 text-sm mb-1 pr-6">{addr.first_name} {addr.last_name}</p>
                              <p className="text-xs text-gray-600 line-clamp-2 pr-6">
                                {addr.address_line1}, {addr.city}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-4">
                          <div className="h-px bg-gray-200 flex-1"></div>
                          <span className="text-xs font-bold text-gray-400 uppercase">Or enter manually</span>
                          <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                        <span className="text-sm">You haven't saved any addresses yet.</span>
                        <a href="/profile" className="text-sm font-bold underline hover:text-blue-900">Add an address</a>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" required value={formData.firstName} onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
                  <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
                  <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
                  <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
                  <textarea placeholder="Full Address" required rows={3} value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
                  <textarea placeholder="Delivery notes (optional)" rows={2} value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 active:scale-95">
                {isProcessing ? 'Processing Order...' : 'Confirm & Pay'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}