import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useStore } from '@/store/useStore';

export const useRealtimeInventory = () => {
  const { showToast, triggerRealtimeUpdate } = useStore();

  useEffect(() => {
    // Only run on client side and if URL/KEY are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) return;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const channel = supabase
      .channel('global_db_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public', // Listen to all tables in public schema that have realtime enabled (like inventory)
        },
        (payload) => {
          console.log('Realtime DB Update:', payload);
          
          if (payload.table === 'inventory' && payload.eventType === 'UPDATE') {
             // Only show toast if it's an inventory update to avoid spam
             // showToast(`Stock updated! New quantity: ${(payload.new as any).quantity}`, 'info');
          }
          
          // Trigger global re-fetch for all active components
          triggerRealtimeUpdate();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to global real-time DB updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerRealtimeUpdate]);
};
