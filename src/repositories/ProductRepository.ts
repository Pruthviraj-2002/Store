import { createServerSupabaseClient } from '@/lib/supabase';

export class ProductRepository {
  /**
   * Fetches a fully hydrated product object suitable for the frontend Product Page
   */
  static async getProductBySlug(slug: string) {
    const supabase = createServerSupabaseClient();
    
    // THE FIX: Add a strict null check
    if (!supabase) {
      throw new Error("Database connection failed: Supabase client is null. Check your environment variables.");
    }
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug),
        images:product_images(id, url, alt_text, display_order),
        specifications:product_specifications(key, value, display_order),
        documents:product_documents(title, url, doc_type),
        variants:product_variants(
          id, sku, name, base_price, sale_price,
          inventory(quantity, reserved_quantity, low_stock_threshold)
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw new Error(`Product fetch failed: ${error.message}`);
    return data;
  }
}