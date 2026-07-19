import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ customers: [] });
  }

  try {
    // Fetch all profiles
    let profilesData = null;
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, is_admin, is_suspended')
      .order('created_at', { ascending: false });

    if (profilesError) {
      if (profilesError.code === '42703') {
        // Fallback: fetch without is_suspended
        const fallback = await supabase
          .from('profiles')
          .select('id, email, full_name, created_at, is_admin')
          .order('created_at', { ascending: false });
        
        if (fallback.error) throw fallback.error;
        profilesData = fallback.data;
      } else {
        throw profilesError;
      }
    } else {
      profilesData = profiles;
    }

    // Fetch all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('profile_id, grand_total, status');

    if (ordersError) throw ordersError;

    // Aggregate data
    const customers = (profilesData || []).map((profile) => {
      // Find orders for this user
      const userOrders = (orders || []).filter((o) => o.profile_id === profile.id);
      
      // Calculate totals
      const totalOrders = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + (Number(order.grand_total) || 0), 0);

      let status = 'Active';
      if (profile.is_admin) status = 'Admin';
      else if (profile.is_suspended) status = 'Suspended';

      return {
        id: profile.id,
        name: profile.full_name || 'Guest User',
        email: profile.email,
        registered: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : 'N/A',
        totalOrders,
        totalSpent,
        status,
        is_admin: profile.is_admin
      };
    });

    return NextResponse.json({ customers });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
  }

  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    if (action === 'suspend' || action === 'activate') {
      const isSuspended = action === 'suspend';
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_suspended: isSuspended })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '42703') {
          return NextResponse.json({ 
            error: 'Database schema update required. Please run the following SQL command in Supabase: ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;' 
          }, { status: 400 });
        }
        throw error;
      }

      return NextResponse.json({ success: true, profile: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
