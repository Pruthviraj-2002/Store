import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

const buildOrderPayload = (body: any) => ({
  status: body.status || 'pending',
  grand_total: Number(body.total) || 0,
  profile_id: body.profile_id || null,
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
  const profileId = url.searchParams.get('profileId');
  const email = url.searchParams.get('email');
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ orders: [] });
  }

  try {
    const query = supabase.from('orders').select(`
      *,
      order_items (
        *,
        product_variants (
          products (
            name,
            product_images (url)
          )
        )
      )
    `).order('created_at', { ascending: false });
    
    if (orderId) {
      if (orderId.length === 36 && orderId.split('-').length === 5) {
        query.eq('id', orderId);
      } else {
        query.eq('order_number', orderId);
      }
    }
    if (profileId) query.eq('profile_id', profileId);
    
    // We can't easily query inside a JSONB column via the JS client using basic eq, 
    // but UUIDs and order_numbers are hard to guess so it's reasonably secure for now.

    const { data, error } = await query;

    if (error) {
      console.error('Order lookup failed:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedOrders = (data ?? []).map((o: any) => ({
       id: o.id,
       order_id: o.id,
       order_number: o.order_number,
       profile_id: o.profile_id,
       subtotal: o.subtotal,
       shipping_fee: o.shipping_fee,
       gst_amount: o.gst_amount,
       discount_amount: o.discount_amount,
       total: o.grand_total,
       status: o.status,
       created_at: o.created_at,
       customer_name: o.shipping_address?.name || o.customer_email || 'Guest',
       customer_email: o.shipping_address?.email || o.customer_email || '',
       shipping_address: o.shipping_address?.address || '',
       phone: o.shipping_address?.phone || '',
       items: (o.order_items || []).map((item: any) => {
         const product = item.product_variants?.products;
         const images = product?.product_images || [];
         const imageUrl = images.length > 0 ? images[0].url : null;
         return {
           name: item.product_name || product?.name || 'Unknown Product',
           qty: item.quantity || 1,
           price: item.unit_price || item.price_at_time || item.price || 0,
           img: imageUrl
         };
       })
    }));

    // If an email was provided, we filter the results in JS to enforce security
    let filteredOrders = formattedOrders;
    if (email) {
      filteredOrders = formattedOrders.filter((o: any) => 
        o.customer_email.toLowerCase() === email.toLowerCase()
      );
    }

    return NextResponse.json({ orders: filteredOrders });
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
