"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// 1. Define strict TypeScript interfaces for better type safety
interface OrderItem {
  name: string;
  sku: string;
  price: string | number;
  qty: string | number;
}

interface Order {
  id: string;
  order_number?: string;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  phone?: string;
  status: string;
  items?: OrderItem[];
  subtotal?: string | number;
  discount_amount?: string | number;
  gst_amount?: string | number;
  total: string | number;
}

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?orderId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch order data");
        
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load the invoice. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!isLoading && order && !error) {
      // 2. Small delay to ensure images/fonts load before auto-triggering the print dialog
      const timer = setTimeout(() => {
        window.print();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isLoading, order, error]);

  // 3. Loading & Error States
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p>Generating your invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500 font-sans">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl border border-red-100">
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p>{error || "Order not found."}</p>
        </div>
      </div>
    );
  }

  // 4. Safely calculate totals
  const total = Number(order.total) || 0;
  const gst = Number(order.gst_amount) || 0;
  const discount = Number(order.discount_amount) || 0;
  // Calculate subtotal if it doesn't exist, reversing the standard formula (Total = Subtotal - Discount + Tax)
  const subtotal = Number(order.subtotal) > 0 
    ? Number(order.subtotal) 
    : (total - gst + discount);

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans print:bg-white print:p-0 p-8 flex justify-center">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .print-hide { display: none !important; }
          @page { size: A4; margin: 0.5cm; }
          .invoice-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; padding: 20px !important; border: none !important; }
        }
      `}} />

      <div className="invoice-container bg-white w-full max-w-[800px] mx-auto shadow-xl border border-gray-200 p-12 md:p-16 relative overflow-hidden rounded-sm">

        {/* Header */}
        <div className="flex justify-between items-start mb-16 relative z-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 leading-none">SK<br />Store</h1>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-4 text-gray-800">Invoice</h2>
            <div className="text-sm text-gray-600 flex flex-col gap-1">
              <p>Invoice No: <span className="font-semibold text-black">#{order.order_number || order.id.substring(0, 8)}</span></p>
              <p>Date: <span className="font-semibold text-black">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
            </div>
          </div>
        </div>

        {/* Bill To & Payment Info */}
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
            <p className="font-bold text-lg leading-tight mb-1">{order.customer_name || order.customer_email || 'Valued Customer'}</p>
            <p className="text-sm text-gray-600 leading-snug whitespace-pre-line max-w-[250px]">
              {order.shipping_address || 'Address not provided'}
            </p>
            {order.phone && <p className="text-sm text-gray-600 mt-1">{order.phone}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Details</h3>
            <p className="font-bold text-base leading-tight mb-1">Online Payment</p>
            <p className="text-sm text-gray-600 leading-snug">
              Status: <span className="font-medium text-green-600">{order.status.toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-3 font-bold uppercase tracking-wider text-xs text-gray-500 w-12">No</th>
                <th className="py-3 font-bold uppercase tracking-wider text-xs text-gray-500">Item Description</th>
                <th className="py-3 font-bold uppercase tracking-wider text-xs text-gray-500 text-right w-24">Price</th>
                <th className="py-3 font-bold uppercase tracking-wider text-xs text-gray-500 text-center w-20">Qty</th>
                <th className="py-3 font-bold uppercase tracking-wider text-xs text-gray-500 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => {
                const price = Number(item.price) || 0;
                const qty = Number(item.qty) || 1;
                return (
                  <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-sm align-top text-gray-400">{idx + 1}</td>
                    <td className="py-4 align-top">
                      <p className="font-bold text-base mb-1">{item.name || 'Product Item'}</p>
                      <p className="text-xs text-gray-500 leading-snug pr-8">SKU: {item.sku || 'N/A'}</p>
                    </td>
                    <td className="py-4 text-right align-top text-sm font-medium text-gray-700">₹{price.toFixed(2)}</td>
                    <td className="py-4 text-center align-top text-sm font-medium text-gray-700">{qty}</td>
                    <td className="py-4 text-right align-top text-sm font-bold">₹{(price * qty).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-16 relative z-10">
          <div className="w-72">
            <div className="border-t border-gray-200 pt-4 mb-4 text-sm text-gray-600">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-medium text-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Discount</span>
                <span className="font-medium text-red-500">- ₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Tax (GST)</span>
                <span className="font-medium text-black">+ ₹{gst.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t-2 border-black pt-4">
              <div className="flex justify-between items-center">
                <span className="font-black text-lg uppercase tracking-wider">Grand Total</span>
                <span className="font-black text-2xl">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 border-t border-gray-100 pt-8 mt-8">
          <p>Thank you for shopping with SK Store!</p>
        </div>
      </div>

      {/* Floating Action Button (Hidden on print) */}
      <div className="fixed bottom-8 right-8 print-hide z-50 flex gap-4">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Download PDF
        </button>
      </div>
    </div>
  );
}