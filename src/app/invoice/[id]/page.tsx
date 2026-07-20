"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?orderId=${id}`);
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!isLoading && order) {
      // Small delay to ensure images/fonts load before printing
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [isLoading, order]);

  if (isLoading) {
    return <div className="p-10 text-center font-sans text-gray-500">Generating Invoice...</div>;
  }

  if (!order) {
    return <div className="p-10 text-center font-sans text-red-500">Order not found.</div>;
  }

  return (
    <div className="bg-white min-h-screen text-black font-sans print:p-0 p-8 flex justify-center">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          footer, nav, .print-hide { display: none !important; }
          @page { size: A4; margin: 0; }
          .invoice-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; padding: 40px !important; border: none !important; }
        }
      `}} />

      <div className="invoice-container bg-white w-full max-w-[800px] mx-auto shadow-2xl border border-gray-100 p-16 relative overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start mb-16 relative z-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-2 leading-none">SK<br />Store</h1>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black uppercase tracking-widest mb-4">Invoice</h2>
            <div className="text-sm text-gray-600 flex flex-col gap-1">
              <p>Invoice Number: <span className="font-medium text-black">#{order.order_number || order.id.substring(0, 8)}</span></p>
              <p>Date: <span className="font-medium text-black">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
            </div>
          </div>
        </div>

        {/* Bill To & Payment Method */}
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Bill To:</h3>
            <p className="font-bold text-lg leading-tight mb-1">{order.customer_name || order.customer_email || 'Customer'}</p>
            <p className="text-sm text-gray-600 leading-snug whitespace-pre-line max-w-[250px]">
              {order.shipping_address || 'Address not provided'}
            </p>
            {order.phone && <p className="text-sm text-gray-600 mt-1">{order.phone}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Payment Method</h3>
            <p className="font-bold text-lg leading-tight mb-1">Online Payment</p>
            <p className="text-sm text-gray-600 leading-snug">
              Status: {order.status.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-3 font-bold uppercase tracking-wider text-sm w-12">No</th>
                <th className="py-3 font-bold uppercase tracking-wider text-sm">Item Description</th>
                <th className="py-3 font-bold uppercase tracking-wider text-sm text-right w-24">Price</th>
                <th className="py-3 font-bold uppercase tracking-wider text-sm text-center w-20">Qty</th>
                <th className="py-3 font-bold uppercase tracking-wider text-sm text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item: any, idx: number) => {
                const price = Number(item.price) || 0;
                const qty = Number(item.qty) || 1;
                return (
                  <tr key={idx}>
                    <td className="py-4 font-medium text-sm align-top">{idx + 1}</td>
                    <td className="py-4 align-top">
                      <p className="font-bold text-base mb-1">{item.name || 'Product Item'}</p>
                      <p className="text-xs text-gray-500 leading-snug pr-8">SKU: {item.sku || 'N/A'}</p>
                    </td>
                    <td className="py-4 text-right align-top text-sm font-medium">₹{price.toFixed(2)}</td>
                    <td className="py-4 text-center align-top text-sm font-medium">{qty}</td>
                    <td className="py-4 text-right align-top text-sm font-medium">₹{(price * qty).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16 relative z-10">
          <div className="w-64">
            <div className="border-t-2 border-black pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold">Total</span>
                <span>₹{(Number(order.total) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Tax (GST)</span>
                <span>₹{(Number(order.gst_amount) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-bold">Discount</span>
                <span>₹{(Number(order.discount_amount) || 0).toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t-2 border-black pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Sub Total</span>
                <span className="font-bold text-lg">₹{((Number(order.subtotal) > 0 ? Number(order.subtotal) : (Number(order.total) - Number(order.gst_amount) + Number(order.discount_amount))) || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info removed as per request */}      </div>

      {/* Print button overlay (hidden during actual print) */}
      <div className="fixed bottom-8 right-8 print-hide z-50">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
