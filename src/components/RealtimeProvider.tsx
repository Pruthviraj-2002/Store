"use client";
import { useEffect, useRef } from 'react';
import { useRealtimeInventory } from '@/hooks/useRealtimeInventory';
import { useStore } from '@/store/useStore';
import { supabaseBrowser } from '@/lib/supabase';

export default function RealtimeProvider() {
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const cartItems = useStore((state) => state.cartItems);
  const setCartItems = useStore((state) => state.setCartItems);
  const isInitialLoad = useRef(true);
  useRealtimeInventory();

  useEffect(() => {
    if (!supabaseBrowser) return;

    // Check active session
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  // Pull cart on login
  useEffect(() => {
    if (!user || !supabaseBrowser) {
      if (!user && !isInitialLoad.current) {
        console.log("User logged out, clearing local cart.");
        setCartItems([]);
      }
      return;
    }

    const fetchCart = async () => {
      console.log("Fetching cart for user:", user.id);
      const { data, error } = await supabaseBrowser
        .from('carts')
        .select('items')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching cart (might be empty):", error);
      }
        
      if (data && data.items) {
         console.log("Loaded cart from DB:", data.items);
         
         // Merge local guest cart with the DB cart
         const currentLocalCart = useStore.getState().cartItems;
         if (currentLocalCart.length > 0) {
           const merged = [...data.items];
           for (const localItem of currentLocalCart) {
             const existingIndex = merged.findIndex((item: any) => item.id === localItem.id);
             if (existingIndex >= 0) {
               merged[existingIndex] = {
                 ...merged[existingIndex],
                 qty: merged[existingIndex].qty + localItem.qty
               };
             } else {
               merged.push(localItem);
             }
           }
           console.log("Merged guest cart into DB cart:", merged);
           setCartItems(merged);
         } else {
           setCartItems(data.items);
         }
      }
      isInitialLoad.current = false;
    };
    
    fetchCart();
  }, [user?.id, setCartItems]);

  // Push cart on change
  useEffect(() => {
    if (isInitialLoad.current || !user || !supabaseBrowser) return;

    const timeout = setTimeout(async () => {
      console.log("Syncing cart to DB...", cartItems);
      const { error } = await supabaseBrowser
        .from('carts')
        .upsert({ id: user.id, items: cartItems, updated_at: new Date().toISOString() });
        
      if (error) {
         console.error("Error saving cart:", error);
      } else {
         console.log("Cart saved successfully!");
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [cartItems, user?.id]);

  return null;
}
