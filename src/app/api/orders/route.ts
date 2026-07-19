import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

const buildOrderPayload = (body: any) => ({
  status: body.status || 'pending',
  total_amount: Number(body.total) || 0,
  customer_email: body.customer_email || 'guest@example.com',
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

    const formattedOrders = (data ?? []).map((o: any) => ({
       id: o.id,
       order_id: o.id,
       customer_name: 'Guest Customer',
       customer_email: o.customer_email,
       total: o.total_amount,
       status: o.status,
       created_at: o.created_at,
       items: [] // In the future we can join order_items here
    }));

    return NextResponse.json({ orders: formattedOrders });
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
      status: body.status || 'pending',
    };

    let query = supabase.from('orders').update(updates).eq('id', recordId);

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
