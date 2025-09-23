import axios from "axios";

const API_BASE_URL = "https://construct-kvv-bn-fork.onrender.com/api/v1";

export interface CartProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  inventory: number;
  isActive: boolean;
  slug: string;
  categoryId: string;
  attributes: Record<string, any>;
  sellerId: string;
  discountedPrice?: string;
  shopId?: string;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  variant: any;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: Cart;
}

class CartService {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  }

  private getAuthHeaders() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      accept: "*/*",
    };
  }

  /**
   * Add item to cart
   */
  async addToCart(
    productId: string,
    quantity: number = 1
  ): Promise<CartResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart`,
        {
          productId,
          quantity,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data as CartResponse;
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }

  /**
   * Get all items in cart
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: this.getAuthHeaders(),
      });
      console.log("Cart response:", response.data);
      return response.data as CartResponse;
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch cart");
    }
  }

  /**
   * Update item quantity in cart
   */
  async updateCartItem(
    cartItemId: string,
    quantity: number
  ): Promise<CartResponse> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/items/${cartItemId}`,
        {
          quantity,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data as CartResponse;
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: string): Promise<CartResponse> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/cart/items/${cartItemId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data as CartResponse;
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      throw new Error(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }

  /**
   * Clear entire cart (if API supports it)
   */
  async clearCart(): Promise<void> {
    try {
      const cart = await this.getCart();
      // Remove all items one by one
      const removePromises = cart.data.items.map((item) =>
        this.removeFromCart(item.id)
      );
      await Promise.all(removePromises);
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      throw new Error("Failed to clear cart");
    }
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.data.totalItems;
    } catch (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }
  }
}

export const cartService = new CartService();

export async function getCheckoutDetails(cartId: string, token: string) {
  const response = await axios.get(
    `${API_BASE_URL}/cart/checkout-details/${cartId}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
