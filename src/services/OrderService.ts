import { createServerSupabaseClient } from '@/lib/supabase';
import { razorpayClient } from '@/lib/razorpay';
import crypto from 'crypto';

export class OrderService {
  static async createOrder(cartId: string, profileId: string, shippingAddress: any, billingAddress: any) {
    const supabase = createServerSupabaseClient(); 
    if (!supabase) throw new Error("Database connection failed.");
    
    const orderNumber = `ORD-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const grandTotal = 5000.00; // Hardcoded fallback for now

    // 1. Create Pending Order
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      profile_id: profileId,
      order_number: orderNumber,
      status: 'pending',
      subtotal: 4500.00,
      gst_amount: 500.00,
      grand_total: grandTotal,
      shipping_address: shippingAddress,
      billing_address: billingAddress
    }).select().single();

    if (orderError) throw orderError;

    // 2. Create Razorpay Token
    const razorpayOrder = await razorpayClient.orders.create({
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      receipt: order.id,
      notes: { order_number: orderNumber }
    });

    // 3. Log Payment Intent
    await supabase.from('payments').insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: grandTotal,
      currency: 'INR',
      status: 'created'
    });

    return { order, razorpayOrderId: razorpayOrder.id, amount: grandTotal };
  }
}