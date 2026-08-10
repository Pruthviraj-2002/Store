import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  getTotals: () => { totalItems: number; totalPrice: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, qty: item.qty + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, qty: quantity }],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, qty) => {
        if (qty < 1) return get().removeItem(id);
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, qty } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setCartItems: (items) => set({ items }),
      getTotals: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => {
            acc.totalItems += item.qty;
            acc.totalPrice += item.price * item.qty;
            return acc;
          },
          { totalItems: 0, totalPrice: 0 }
        );
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
