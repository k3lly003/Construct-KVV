import { create } from "zustand";
import { useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  weight: number;
  dimensions?: string;
}

interface CartState {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const CART_KEY = "kvv_cart_items";

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  setCartItems: (items) => {
    set({ cartItems: items });
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      console.log("[CartStore] setCartItems:", items);
    }
  },
  addToCart: (item) => {
    const items = get().cartItems;
    const existing = items.find((i) => i.id === item.id);
    let newItems;
    if (existing) {
      newItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      newItems = [...items, item];
    }
    set({ cartItems: newItems });
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_KEY, JSON.stringify(newItems));
      console.log("[CartStore] addToCart:", newItems);
    }
  },
  removeFromCart: (id) => {
    const newItems = get().cartItems.filter((i) => i.id !== id);
    set({ cartItems: newItems });
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_KEY, JSON.stringify(newItems));
      console.log("[CartStore] removeFromCart:", newItems);
    }
  },
  updateQuantity: (id, quantity) => {
    const newItems = get().cartItems.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    set({ cartItems: newItems });
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_KEY, JSON.stringify(newItems));
      console.log("[CartStore] updateQuantity:", newItems);
    }
  },
  clearCart: () => {
    set({ cartItems: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_KEY);
      console.log("[CartStore] clearCart: []");
    }
  },
  getCartCount: () => get().cartItems.reduce((sum, i) => sum + i.quantity, 0),
}));

// Hydrate cart from localStorage on mount (React hook)
export function useCartHydration() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        try {
          const items = JSON.parse(stored);
          if (Array.isArray(items)) {
            useCartStore.getState().setCartItems(items);
            console.log("[CartStore] Hydrated from localStorage:", items);
          }
        } catch (e) {
          console.error("[CartStore] Failed to hydrate from localStorage", e);
        }
      } else {
        console.log("[CartStore] No cart found in localStorage");
      }
    }
  }, []);
}
