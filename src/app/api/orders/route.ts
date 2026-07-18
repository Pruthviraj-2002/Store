import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

const buildOrderPayload = (body: any) => ({
  order_id: body.order_id || `SK-${Date.now().toString().slice(-6)}`,
  customer_name: body.customer_name || 'Guest Customer',
  customer_email: body.customer_email || '',
  shipping_address: body.shipping_address || '',
  phone: body.phone || '',
  items: body.items || [],
  total: Number(body.total) || 0,
  status: body.status || 'Pending',
  currency: body.currency || 'INR',
  created_at: body.created_at || new Date().toISOString(),
  expected_delivery: body.expected_delivery || '',
});

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServerSupabaseClient();
  const payload = buildOrderPayload(body);

  if (!supabase) {
    return NextResponse.json({ order: payload, warning: 'Supabase is not configured' }, { status: 201 });
  }

  try {
    const { data, error } = await supabase.from('orders').insert([payload]).select('*').single();

    if (error) {
      console.error('Order insert failed:', error.message);
      return NextResponse.json({ order: payload, warning: error.message }, { status: 201 });
    }

    return NextResponse.json({ order: data ?? payload }, { status: 201 });
  } catch (error) {
    console.error('Order insert failed:', error);
    return NextResponse.json({ order: payload, warning: 'Order saved locally' }, { status: 201 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('orderId');
  const email = url.searchParams.get('email');
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ orders: [] });
  }

  try {
    const query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (orderId) query.eq('order_id', orderId);
    if (email) query.eq('customer_email', email);

    const { data, error } = await query;

    if (error) {
      console.error('Order lookup failed:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data ?? [] });
  } catch (error) {
    console.error('Order lookup failed:', error);
    return NextResponse.json({ error: 'Unable to load orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ order: body, warning: 'Supabase is not configured' });
  }

  try {
    const recordId = body.id || body.order_id;
    const updates = {
      status: body.status || 'Pending',
      updated_at: new Date().toISOString(),
    };

    let query = supabase.from('orders').update(updates).eq('id', recordId);
    if (!recordId) {
      query = supabase.from('orders').update(updates).eq('order_id', body.order_id);
    }

    const { data, error } = await query.select('*').single();

    if (error) {
      console.error('Order update failed:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error('Order update failed:', error);
    return NextResponse.json({ error: 'Unable to update order' }, { status: 500 });
  }
}
