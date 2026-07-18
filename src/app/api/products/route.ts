import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

const fallbackProducts = [
  {
    id: 'fallback-1',
    slug: 'arduino-uno-r3',
    name: 'Arduino Uno R3',
    price: 1499,
    stock: 150,
    image_url: 'https://images.unsplash.com/photo-1559819614-81fea9efd090?w=600&q=80',
    category: 'Development Boards',
    categories: { id: 'cat-1', name: 'Development Boards', slug: 'development-boards' },
  },
  {
    id: 'fallback-2',
    slug: 'esp32-nodemcu',
    name: 'ESP32 NodeMCU',
    price: 399,
    stock: 300,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    category: 'Development Boards',
    categories: { id: 'cat-1', name: 'Development Boards', slug: 'development-boards' },
  },
  {
    id: 'fallback-3',
    slug: '10k-resistor-pack',
    name: '10k Ohm 1/4W Resistor (Pack of 100)',
    price: 45,
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80',
    category: 'Passive Components',
    categories: { id: 'cat-2', name: 'Passive Components', slug: 'passive-components' },
  },
];

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ products: fallbackProducts });
  }

  try {
    // Advanced Relational Query: Joins Brands, Categories, Variants, Inventory, and Images!
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_description,
        categories ( name, slug ),
        brands ( name ),
        product_variants ( id, base_price, sale_price, sku, inventory ( quantity ) ),
        product_images ( url )
      `)
      .eq('is_published', true);

    if (error) {
      console.error('Supabase product fetch failed:', error.message);
      return NextResponse.json({ products: fallbackProducts });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ products: fallbackProducts });
    }

    // Flatten the complex relational data into the simple format your React frontend expects
    const formattedProducts = data.map((item: any) => {
      // Safely extract the default variant and inventory
      const defaultVariant = item.product_variants?.[0] || {};
      
      // Handle the inventory array/object from the join
      let stockQuantity = 0;
      if (Array.isArray(defaultVariant.inventory)) {
        stockQuantity = defaultVariant.inventory[0]?.quantity || 0;
      } else if (defaultVariant.inventory) {
        stockQuantity = defaultVariant.inventory.quantity || 0;
      }

      return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        brand: item.brands?.name || 'Generic',
        description: item.short_description || '',
        price: defaultVariant.sale_price || defaultVariant.base_price || 0,
        sktPartNo: defaultVariant.sku || 'N/A',
        stock: stockQuantity,
        image_url: item.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
        category: item.categories?.name || 'Hardware',
        categories: item.categories
      };
    });

    return NextResponse.json({ products: formattedProducts });

  } catch (error) {
    console.error('Product fetch failed:', error);
    return NextResponse.json({ products: fallbackProducts });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
  }
  
  const { data, error } = await supabase.from('products').insert([body]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  const newProduct = data && Array.isArray(data) ? data[0] : null;
  return NextResponse.json({ product: newProduct }, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  }
  
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
  }
  
  const { data, error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  const deletedProduct = data && Array.isArray(data) ? data[0] : null;
  return NextResponse.json({ product: deletedProduct });
}