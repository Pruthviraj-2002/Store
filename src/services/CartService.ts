import { createServerSupabaseClient } from '@/lib/supabase';

export class CartService {
  static async getCart(profileId?: string, sessionId?: string) {
    const supabase = createServerSupabaseClient();
    if (!supabase) throw new Error("Database connection failed.");
    
    // Fetch Cart Details
    const query = supabase.from('carts').select(`
      id,
      coupon_id,
      coupons ( code, discount_type, discount_value, max_discount_amount ),
      items:cart_items (
        id,
        quantity,
        variant:product_variants (
          id, sku, name, base_price, sale_price,
          product:products ( name, slug, images:product_images(url) ),
          inventory:inventory ( quantity, reserved_quantity )
        )
      )
    `);

    if (profileId) query.eq('profile_id', profileId);
    else if (sessionId) query.eq('session_id', sessionId);
    
    const { data: cart, error } = await query.single();
    if (error || !cart) return null;

    // Calculate Pricing
    let subtotal = 0;
    const processedItems = cart.items.map((item: any) => {
      const priceToUse = item.variant.sale_price || item.variant.base_price;
      const itemTotal = priceToUse * item.quantity;
      subtotal += itemTotal;
      return {
        ...item,
        is_in_stock: (item.variant.inventory.quantity - item.variant.inventory.reserved_quantity) >= item.quantity,
        item_total: itemTotal
      };
    });

    // Apply basic 18% GST logic (expand coupons later)
    const gstAmount = subtotal * 0.18;
    const grandTotal = subtotal + gstAmount;

    return {
      cart_id: cart.id,
      items: processedItems,
      pricing: { subtotal, discount: 0, gst_amount: gstAmount, grand_total: grandTotal }
    };
  }
}