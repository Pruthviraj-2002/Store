import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
  }

  try {
    const { items, customerEmail, totalAmount, subtotal, gst_amount, profileId, shippingAddress } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Create the Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          status: 'paid', 
          subtotal: subtotal || totalAmount,
          gst_amount: gst_amount || 0,
          grand_total: totalAmount, 
          profile_id: profileId || null,
          shipping_address: shippingAddress || { email: customerEmail || 'guest@example.com' },
          billing_address: shippingAddress || { email: customerEmail || 'guest@example.com' },
          order_number: `ORD-${Math.floor(Math.random() * 1000000)}`
        }
      ])
      .select()
      .single();

    if (orderError) throw new Error(`Order Creation Failed: ${orderError.message}`);
    const orderId = orderData.id;

    // 2. Process Items (Decrement Stock & Create Order Items)
    for (const item of items) {
      // Find the variant ID linked to this product (for simplistic setup we just find the first one)
      const { data: variantData, error: variantError } = await supabase
        .from('product_variants')
        .select('id, base_price, sku, inventory(variant_id, quantity)')
        .eq('product_id', item.id)
        .limit(1)
        .single();
        
      if (variantError) {
        console.error("Variant Fetch Error for product", item.id, ":", variantError);
      }

      let variantId = null;
      let sku = `SKU-${item.id.substring(0, 8)}`;
      let currentStock = 0;
      let invVariantId = null;

      if (variantData) {
        variantId = variantData.id;
        sku = variantData.sku || sku;
        const inventory: any = variantData.inventory;
        currentStock = Array.isArray(inventory) 
          ? inventory[0]?.quantity 
          : inventory?.quantity || 0;
        
        invVariantId = Array.isArray(inventory) 
          ? inventory[0]?.variant_id 
          : inventory?.variant_id;
          
        if (currentStock > 0 && currentStock < item.qty) {
           console.warn(`Not enough stock for ${item.name}, but continuing order for testing purposes.`);
        }
      }

      // Add to Order Items regardless of variant existence
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert([
          { 
            order_id: orderId, 
            variant_id: variantId, 
            product_name: item.name || 'Product',
            sku: sku,
            quantity: item.qty, 
            unit_price: item.price,
            total_price: item.price * item.qty
          }
        ]);
        
      if (itemsError) {
        console.error("Order Item Insert Error: ", itemsError);
      }

      // Decrement Inventory (This will trigger the Real-time listeners!)
      if (invVariantId) {
        await supabase
          .from('inventory')
          .update({ quantity: Math.max(0, currentStock - item.qty) })
          .eq('variant_id', invVariantId);
      }
    }

    return NextResponse.json({ success: true, orderId }, { status: 200 });

  } catch (error: any) {
    console.error('Checkout failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}