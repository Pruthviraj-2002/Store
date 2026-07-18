import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event;
    const paymentEntity = body.payload?.payment?.entity;
    const supabase = createServerSupabaseClient();
    if (!supabase) throw new Error("Database connection failed.");

    // Only process successful payments
    if (event === 'payment.captured' || event === 'payment.authorized') {
      const razorpayOrderId = paymentEntity.order_id;

      const { data: payment } = await supabase
        .from('payments')
        .select('order_id')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (payment) {
        // Mark payment as captured
        await supabase.from('payments').update({ status: 'captured', razorpay_payment_id: paymentEntity.id }).eq('razorpay_order_id', razorpayOrderId);
        // Mark order as paid
        await supabase.from('orders').update({ status: 'paid' }).eq('id', payment.order_id);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}