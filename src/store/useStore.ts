import { create } from 'zustand';

// 1. Define the type for a single cart item
export interface CartItem {
  id: string | number;
  name: string;
  desc: string;
  price: number;
  qty: number;
  stock: string;
  img: string;
}

// 2. Define the exact shape of your entire store (This is where your error was!)
export interface StoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  cartItems: CartItem[];
  cartTotalItems: number;
  
  // This line right here tells TypeScript that addToCart exists!
  addToCart: (product: any, qty: number) => void; 
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
}

// 3. Create the store using the interface
export const useStore = create<StoreState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: 'All Categories',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  // Cart Initial State
  cartItems: [
    {
      id: 1,
      name: "STM32F103C8T6",
      desc: "ARM 32-bit Cortex-M3 MCU, 72MHz, 64KB Flash, LQFP-48",
      price: 85.00,
      qty: 2,
      stock: "In Stock (2,450 units)",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80"
    }
  ],
  cartTotalItems: 2,

  // --- Cart Actions ---
  
  addToCart: (product, qty) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    let newItems;
    
    if (existingItem) {
      newItems = state.cartItems.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      newItems = [...state.cartItems, { ...product, qty }];
    }

    return { 
      cartItems: newItems, 
      cartTotalItems: newItems.reduce((total, item) => total + item.qty, 0) 
    };
  }),

  updateQuantity: (id, qty) => set((state) => {
    if (qty < 1) return state; 
    const newItems = state.cartItems.map(item => 
      item.id === id ? { ...item, qty } : item
    );
    return { 
      cartItems: newItems, 
      cartTotalItems: newItems.reduce((total, item) => total + item.qty, 0) 
    };
  }),

  removeFromCart: (id) => set((state) => {
    const newItems = state.cartItems.filter(item => item.id !== id);
    return { 
      cartItems: newItems, 
      cartTotalItems: newItems.reduce((total, item) => total + item.qty, 0) 
    };
  }),

  clearCart: () => set({ cartItems: [], cartTotalItems: 0 }),
}));