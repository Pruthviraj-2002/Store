import { create } from 'zustand';

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
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  cartItems: CartItem[];
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (product: any, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedCategory: 'All Categories',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  cartItems: [],
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
          ),
          isCartOpen: true,
        };
      }

      return {
        cartItems: [...state.cartItems, normalizedProduct],
        isCartOpen: true,
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
}));