import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ categories: [] });
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name, slug, id');

    if (error) {
      console.error('Failed to fetch categories:', error.message);
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json({ categories: data || [] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ categories: [] });
  }
}
