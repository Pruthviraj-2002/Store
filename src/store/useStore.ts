import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  desc?: string;
  stock?: string;
  price: number;
  qty: number;
  img?: string;
  image_url?: string;
}

interface StoreState {
  // Auth state
  user: any | null;
  setUser: (user: any | null) => void;

  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (product: any, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;

  quickViewProduct: any | null;
  setQuickViewProduct: (product: any | null) => void;

  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  realtimeUpdateTrigger: number;
  triggerRealtimeUpdate: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
  // Auth state
  user: null,
  setUser: (user) => set({ user }),

  selectedCategory: 'All Categories',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (product, qty = 1) =>
    set((state) => {
      const normalizedProduct: CartItem = {
        id: product.id,
        name: product.name || product.title || 'Product',
        desc: product.desc || product.description || '',
        stock: product.stock || product.stockText || 'In Stock',
        price: Number(product.price) || 0,
        qty,
        img: product.img || product.image_url || product.images?.[0] || '',
        image_url: product.image_url || product.img || product.images?.[0] || '',
      };

      const existingItem = state.cartItems.find((item) => item.id === normalizedProduct.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === normalizedProduct.id ? { ...item, qty: item.qty + qty } : item
          )
        };
      }

      return {
        cartItems: [...state.cartItems, normalizedProduct]
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId, qty) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
      ),
    })),

  clearCart: () => set({ cartItems: [] }),

  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 3000); // Auto-hide after 3 seconds
  },
  hideToast: () => set({ toast: null }),
  
  realtimeUpdateTrigger: 0,
  triggerRealtimeUpdate: () => set((state) => ({ realtimeUpdateTrigger: state.realtimeUpdateTrigger + 1 })),
    }),
    {
      name: 'sk-store-cart',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);