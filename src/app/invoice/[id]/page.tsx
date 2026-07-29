"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// 1. TypeScript Interfaces
interface OrderItem {
  name: string;
  sku: string;
  hsn: string;
  price: number;
  qty: number;
  tax_rate: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  shipping_address: string;
  phone: string;
  status: string;
  transaction_id: string;
  payment_method: string;
  place_of_supply: string;
  customer_gstin?: string;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total: number;
}

// 2. Store Details (Keep this static unless you have an API for store settings)
const storeDetails = {
  name: "SK Store",
  legal_name: "SK Technologies Pvt. Ltd.",
  address: "Plot 12, Tech Park, Madhapur,\nHyderabad, Telangana 500081, India",
  email: "support@skstore.in",
  phone: "+91-9876543210",
  gstin: "36AAAAA1234A1Z5", 
  cin: "U72900TG2026PTC123456" 
};

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id as string;
  
  // 3. Set initial states to null and loading to true
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. DYNAMIC FETCHING LOGIC: This pulls the real data based on the URL ID
  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      
      try {
        // Make sure this endpoint matches your actual backend route!
        const res = await fetch(`/api/orders?orderId=${id}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }
        
        const data = await res.json();
        
        // Assuming your API returns { orders: [ { ...orderData } ] }
        if (data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not load invoice data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  // 5. Loading and Error UI States
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p>Fetching your invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500 font-sans">
        <div className="text-center p-8 bg-white shadow-lg border border-red-100 rounded">
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p>{error || "Order not found."}</p>
        </div>
      </div>
    );
  }

  // 6. The actual Invoice UI (Now using dynamic 'order' data)
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

        <div className="flex justify-between items-start mb-12 relative z-10 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 leading-none">{storeDetails.name}</h1>
            <p className="font-bold text-xs text-gray-800">{storeDetails.legal_name}</p>
            <p className="text-xs text-gray-600 whitespace-pre-line mt-1">{storeDetails.address}</p>
            <div className="text-xs text-gray-600 mt-2 flex flex-col gap-0.5">
              <p>Email: {storeDetails.email}</p>
              <p>Phone: {storeDetails.phone}</p>
              <p className="font-medium text-gray-800 mt-1">GSTIN: {storeDetails.gstin}</p>
              <p className="font-medium text-gray-800">CIN: {storeDetails.cin}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-4 text-gray-800">Tax Invoice</h2>
            <div className="text-sm text-gray-600 flex flex-col gap-1">
              <p>Invoice No: <span className="font-semibold text-black">#{order.order_number}</span></p>
              <p>Date: <span className="font-semibold text-black">{new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
            <p className="font-bold text-lg leading-tight mb-1">{order.customer_name}</p>
            <p className="text-sm text-gray-600 leading-snug whitespace-pre-line max-w-[250px]">
              {order.shipping_address}
            </p>
            <p className="text-sm text-gray-600 mt-1">{order.phone}</p>
            <div className="mt-3 text-xs">
              <p><span className="text-gray-500 font-semibold">Place of Supply:</span> <span className="font-medium">{order.place_of_supply}</span></p>
              {order.customer_gstin && (
                <p><span className="text-gray-500 font-semibold">Buyer GSTIN:</span> <span className="font-medium">{order.customer_gstin}</span></p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Details</h3>
            <p className="font-bold text-base leading-tight mb-1">{order.payment_method}</p>
            <p className="text-sm text-gray-600 leading-snug mb-1">
              Status: <span className="font-bold text-green-600">{order.status.toUpperCase()}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">Txn ID: {order.transaction_id}</p>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold uppercase tracking-wider text-[10px] text-gray-500 w-8">No</th>
                <th className="py-2 font-bold uppercase tracking-wider text-[10px] text-gray-500">Item Description</th>
                <th className="py-2 font-bold uppercase tracking-wider text-[10px] text-gray-500 text-center w-16">HSN/SAC</th>
                <th className="py-2 font-bold uppercase tracking-wider text-[10px] text-gray-500 text-right w-20">Price</th>
                <th className="py-2 font-bold uppercase tracking-wider text-[10px] text-gray-500 text-center w-12">Qty</th>
                <th className="py-2 font-bold uppercase tracking-wider text-[10px] text-gray-500 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-xs align-top text-gray-400">{idx + 1}</td>
                  <td className="py-4 align-top">
                    <p className="font-bold text-sm mb-1">{item.name}</p>
                    <p className="text-[10px] text-gray-500 pr-8">SKU: {item.sku}</p>
                  </td>
                  <td className="py-4 text-center align-top text-xs text-gray-500">{item.hsn}</td>
                  <td className="py-4 text-right align-top text-sm font-medium text-gray-700">₹{Number(item.price).toFixed(2)}</td>
                  <td className="py-4 text-center align-top text-sm font-medium text-gray-700">{item.qty}</td>
                  <td className="py-4 text-right align-top text-sm font-bold">₹{(Number(item.price) * Number(item.qty)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-12 relative z-10">
          <div className="w-72">
            <div className="border-t border-gray-200 pt-3 mb-3 text-sm text-gray-600">
              <div className="flex justify-between mb-1.5">
                <span>Taxable Amount (Subtotal)</span>
                <span className="font-medium text-black">₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between mb-1.5">
                  <span>Discount</span>
                  <span className="font-medium text-red-500">- ₹{Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              {Number(order.cgst_amount) > 0 && Number(order.sgst_amount) > 0 ? (
                <>
                  <div className="flex justify-between mb-1.5 text-xs">
                    <span>CGST (9%)</span>
                    <span className="font-medium text-gray-800">+ ₹{Number(order.cgst_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-3 text-xs">
                    <span>SGST (9%)</span>
                    <span className="font-medium text-gray-800">+ ₹{Number(order.sgst_amount).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between mb-3 text-xs">
                  <span>IGST (18%)</span>
                  <span className="font-medium text-gray-800">+ ₹{Number(order.igst_amount || 0).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t-2 border-black pt-3">
              <div className="flex justify-between items-center">
                <span className="font-black text-lg uppercase tracking-wider">Grand Total</span>
                <span className="font-black text-2xl">₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between items-end">
          <div className="max-w-[60%]">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Terms & Conditions</h4>
            <ul className="text-[10px] text-gray-500 list-disc list-inside space-y-1">
              <li>All claims, if any, must be made within 7 days of delivery.</li>
              <li>Goods once sold will not be taken back unless defective.</li>
              <li>Subject to Hyderabad jurisdiction only.</li>
            </ul>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="h-12 w-32 border-b border-gray-300 mb-2 flex items-end justify-center pb-1">
               <span className="text-gray-300 text-xs italic">SK Store Auth</span>
            </div>
            <p className="text-[10px] font-bold text-gray-800">Authorized Signatory</p>
            <p className="text-[9px] text-gray-400 mt-1 max-w-[200px]">
              This is a computer-generated invoice and does not require a physical signature.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 print-hide z-50 flex gap-4">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 hover:scale-105 transition-all flex items-center gap-2"
        >
          Print / Download PDF
        </button>
      </div>
    </div>
  );
}