import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
  }

  try {
    const { items, customerEmail, totalAmount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Create the Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          status: 'paid', 
          total_amount: totalAmount, 
          customer_email: customerEmail || 'guest@example.com' 
        }
      ])
      .select()
      .single();

    if (orderError) throw new Error(`Order Creation Failed: ${orderError.message}`);
    const orderId = orderData.id;

    // 2. Process Items (Decrement Stock & Create Order Items)
    for (const item of items) {
      // Find the variant ID linked to this product (for simplistic setup we just find the first one)
      const { data: variantData } = await supabase
        .from('product_variants')
        .select('id, base_price, inventory(id, quantity)')
        .eq('product_id', item.id)
        .single();

      if (variantData) {
        const variantId = variantData.id;
        const currentStock = Array.isArray(variantData.inventory) 
          ? variantData.inventory[0]?.quantity 
          : variantData.inventory?.quantity || 0;

        // Check if we have enough stock
        if (currentStock < item.qty) {
          throw new Error(`Not enough stock for ${item.name}`);
        }

        // Add to Order Items
        await supabase
          .from('order_items')
          .insert([
            { order_id: orderId, variant_id: variantId, quantity: item.qty, price_at_time: item.price }
          ]);

        // Decrement Inventory (This will trigger the Real-time listeners!)
        const inventoryId = Array.isArray(variantData.inventory) 
          ? variantData.inventory[0]?.id 
          : variantData.inventory?.id;
          
        if (inventoryId) {
          await supabase
            .from('inventory')
            .update({ quantity: currentStock - item.qty })
            .eq('id', inventoryId);
        }
      }
    }

    return NextResponse.json({ success: true, orderId }, { status: 200 });

  } catch (error: any) {
    console.error('Checkout failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}