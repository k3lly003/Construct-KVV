"use client";

import { create } from "zustand";
import {
  cartService,
  Cart,
  CartItem,
  CartProduct,
} from "@/app/services/cartService";
import { useAuth } from "@/hooks/useAuth";

export type { CartItem } from "@/app/services/cartService";

// Local cart item interface for compatibility with existing components
export interface LocalCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  weight: number;
  dimensions?: string;
  // API-specific fields
  cartItemId?: string; // The cart item ID from API
  productId?: string; // The product ID from API
}

interface CartState {
  cartItems: LocalCartItem[];
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCartItems: (items: LocalCartItem[]) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => number;
  fetchCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  cart: null,
  isLoading: false,
  error: null,

  setCartItems: (items) => {
    set({ cartItems: items });
    console.log("[CartStore] setCartItems:", items);
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const { setLoading, setError, fetchCart } = get();

    try {
      setLoading(true);
      setError(null);

      await cartService.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart after adding

      console.log("[CartStore] addToCart: Item added successfully");
    } catch (error: any) {
      console.error("[CartStore] addToCart error:", error);
      setError(error.message || "Failed to add item to cart");
      throw error;
    } finally {
      setLoading(false);
    }
  },

  removeFromCart: async (cartItemId: string) => {
    const { setLoading, setError, fetchCart } = get();

    try {
      setLoading(true);
      setError(null);

      await cartService.removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart after removing

      console.log("[CartStore] removeFromCart: Item removed successfully");
    } catch (error: any) {
      console.error("[CartStore] removeFromCart error:", error);
      setError(error.message || "Failed to remove item from cart");
      throw error;
    } finally {
      setLoading(false);
    }
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    const { setLoading, setError, fetchCart } = get();

    try {
      setLoading(true);
      setError(null);

      await cartService.updateCartItem(cartItemId, quantity);
      await fetchCart(); // Refresh cart after updating

      console.log("[CartStore] updateQuantity: Quantity updated successfully");
    } catch (error: any) {
      console.error("[CartStore] updateQuantity error:", error);
      setError(error.message || "Failed to update quantity");
      throw error;
    } finally {
      setLoading(false);
    }
  },

  clearCart: async () => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      await cartService.clearCart();
      set({ cartItems: [], cart: null });

      console.log("[CartStore] clearCart: Cart cleared successfully");
    } catch (error: any) {
      console.error("[CartStore] clearCart error:", error);
      setError(error.message || "Failed to clear cart");
      throw error;
    } finally {
      setLoading(false);
    }
  },

  getCartCount: () => {
    const { cart } = get();
    return cart?.totalItems || 0;
  },

  fetchCart: async () => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await cartService.getCart();
      const cart = response.data;

      // Convert API cart items to local cart items for compatibility
      const localCartItems: LocalCartItem[] = cart.items.map(
        (item: CartItem) => ({
          id: item.product.id, // Use product ID as the main ID
          cartItemId: item.id, // Store the cart item ID for API operations
          productId: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
          image: "", // Will be handled by image utilities
          category: item.product.categoryId,
          weight: 0, // Not provided by API
          dimensions: item.product.attributes?.dimensions || "",
        })
      );

      set({ cart, cartItems: localCartItems });
      console.log("[CartStore] fetchCart: Cart fetched successfully", cart);
    } catch (error: any) {
      console.error("[CartStore] fetchCart error:", error);
      setError(error.message || "Failed to fetch cart");
      // Don't clear existing cart on error, just show error
    } finally {
      setLoading(false);
    }
  },
}));

// Hook to hydrate cart from API on mount
export function useCartHydration() {
  const { fetchCart } = useCartStore();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch cart when user is authenticated
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, authLoading, fetchCart]);
}

// Import React for useEffect
import React from "react";
