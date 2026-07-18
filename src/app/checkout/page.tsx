"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStore } from '@/store/useStore';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  notes: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    notes: '',
  });

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage(null);

    try {
      const orderPayload = {
        order_id: `SK-${Date.now().toString().slice(-6)}`,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        shipping_address: `${formData.address}\nPhone: ${formData.phone || 'N/A'}\n${formData.notes}`.trim(),
        phone: formData.phone,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          img: item.img || item.image_url || '',
        })),
        total: Number(cartTotal.toFixed(2)),
        status: 'Pending',
        currency: 'INR',
        created_at: new Date().toISOString(),
        expected_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to place order');
      }

      clearCart();
      router.push(`/track-order?orderId=${encodeURIComponent(result.order?.order_id || orderPayload.order_id)}&email=${encodeURIComponent(formData.email)}`);
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
              <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">₹{cartTotal.toFixed(2)}</span>
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