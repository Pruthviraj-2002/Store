import { create } from 'zustand';

// Define the shape of a single cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  desc?: string;
  stock?: string;
}

// Define the shape of the entire store
interface StoreState {
  // Cart State
  cartItems: CartItem[];
  addToCart: (product: any, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // --- NEW: Cart Drawer UI State ---
  isCartOpen: boolean;
  toggleCart: () => void;

  // Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Cart Initial State
  cartItems: [],
  
  addToCart: (product, qty) => set((state) => {
    const existingItem = state.cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        ),
      };
    }
    return { cartItems: [...state.cartItems, { ...product, qty }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.id !== id),
  })),

  clearCart: () => set({ cartItems: [] }),

  // --- NEW: Drawer UI Logic ---
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // Filter Initial State
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  selectedCategory: "All Categories",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));