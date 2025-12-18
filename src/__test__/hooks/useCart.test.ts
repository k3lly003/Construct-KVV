import { renderHook, act, waitFor } from '@testing-library/react';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/app/services/cartService';

// Mock cartService
jest.mock('@/app/services/cartService', () => ({
  cartService: {
    addToCart: jest.fn(),
    getCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  },
}));

// Mock useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('useCartStore', () => {
  const mockCart = {
    id: 'cart-1',
    items: [
      {
        id: 'cart-item-1',
        product: {
          id: 'product-1',
          name: 'Cement 50kg',
          price: '50000',
          categoryId: 'cat-1',
          attributes: { dimensions: '50kg' },
        },
        quantity: 2,
        price: 50000,
        subtotal: 100000,
      },
    ],
    totalItems: 2,
    subtotal: 100000,
    total: 100000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useCartStore.setState({
      cartItems: [],
      cart: null,
      isLoading: false,
      error: null,
    });
  });

  describe('addToCart', () => {
    test('adds item to cart successfully', async () => {
      // Arrange
      (cartService.addToCart as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCart,
      });
      (cartService.getCart as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCart,
      });

      // Act
      await act(async () => {
        await useCartStore.getState().addToCart('product-1', 1);
      });

      // Assert
      await waitFor(() => {
        expect(cartService.addToCart).toHaveBeenCalledWith('product-1', 1);
        expect(cartService.getCart).toHaveBeenCalled();
      });
    });

    test('handles add to cart errors', async () => {
      // Arrange
      const errorMessage = 'Failed to add item';
      (cartService.addToCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await act(async () => {
        await expect(useCartStore.getState().addToCart('product-1', 1)).rejects.toThrow(
          errorMessage
        );
      });

      await waitFor(() => {
        expect(useCartStore.getState().error).toBe(errorMessage);
      });
    });
  });

  describe('removeFromCart', () => {
    test('removes item from cart successfully', async () => {
      // Arrange
      (cartService.removeFromCart as jest.Mock).mockResolvedValue({
        success: true,
        data: { ...mockCart, items: [] },
      });
      (cartService.getCart as jest.Mock).mockResolvedValue({
        success: true,
        data: { ...mockCart, items: [] },
      });

      // Act
      await act(async () => {
        await useCartStore.getState().removeFromCart('cart-item-1');
      });

      // Assert
      await waitFor(() => {
        expect(cartService.removeFromCart).toHaveBeenCalledWith('cart-item-1');
        expect(cartService.getCart).toHaveBeenCalled();
      });
    });

    test('handles remove from cart errors', async () => {
      // Arrange
      const errorMessage = 'Failed to remove item';
      (cartService.removeFromCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await act(async () => {
        await expect(
          useCartStore.getState().removeFromCart('cart-item-1')
        ).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('updateQuantity', () => {
    test('updates item quantity successfully', async () => {
      // Arrange
      (cartService.updateCartItem as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCart,
      });
      (cartService.getCart as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCart,
      });

      // Act
      await act(async () => {
        await useCartStore.getState().updateQuantity('cart-item-1', 3);
      });

      // Assert
      await waitFor(() => {
        expect(cartService.updateCartItem).toHaveBeenCalledWith('cart-item-1', 3);
        expect(cartService.getCart).toHaveBeenCalled();
      });
    });

    test('handles update quantity errors', async () => {
      // Arrange
      const errorMessage = 'Failed to update quantity';
      (cartService.updateCartItem as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await act(async () => {
        await expect(
          useCartStore.getState().updateQuantity('cart-item-1', 3)
        ).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('clearCart', () => {
    test('clears cart successfully', async () => {
      // Arrange
      (cartService.clearCart as jest.Mock).mockResolvedValue(undefined);

      // Act
      await act(async () => {
        await useCartStore.getState().clearCart();
      });

      // Assert
      await waitFor(() => {
        expect(cartService.clearCart).toHaveBeenCalled();
        expect(useCartStore.getState().cartItems).toEqual([]);
        expect(useCartStore.getState().cart).toBeNull();
      });
    });

    test('handles clear cart errors', async () => {
      // Arrange
      const errorMessage = 'Failed to clear cart';
      (cartService.clearCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await act(async () => {
        await expect(useCartStore.getState().clearCart()).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('fetchCart', () => {
    test('fetches cart successfully', async () => {
      // Arrange
      (cartService.getCart as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCart,
      });

      // Act
      await act(async () => {
        await useCartStore.getState().fetchCart();
      });

      // Assert
      await waitFor(() => {
        expect(cartService.getCart).toHaveBeenCalled();
        expect(useCartStore.getState().cart).toEqual(mockCart);
        expect(useCartStore.getState().cartItems.length).toBeGreaterThan(0);
      });
    });

    test('handles fetch cart errors', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch cart';
      (cartService.getCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act
      await act(async () => {
        await useCartStore.getState().fetchCart();
      });

      // Assert
      await waitFor(() => {
        expect(useCartStore.getState().error).toBe(errorMessage);
      });
    });
  });

  describe('getCartCount', () => {
    test('returns correct cart count', () => {
      // Arrange
      useCartStore.setState({
        cart: {
          ...mockCart,
          totalItems: 5,
        },
      });

      // Act
      const count = useCartStore.getState().getCartCount();

      // Assert
      expect(count).toBe(5);
    });

    test('returns 0 when cart is null', () => {
      // Arrange
      useCartStore.setState({ cart: null });

      // Act
      const count = useCartStore.getState().getCartCount();

      // Assert
      expect(count).toBe(0);
    });
  });

  describe('Loading states', () => {
    test('sets loading state during operations', async () => {
      // Arrange
      (cartService.addToCart as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      (cartService.getCart as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCart,
      });

      // Act
      const promise = act(async () => {
        await useCartStore.getState().addToCart('product-1', 1);
      });

      // Assert
      expect(useCartStore.getState().isLoading).toBe(true);

      await promise;

      await waitFor(() => {
        expect(useCartStore.getState().isLoading).toBe(false);
      });
    });
  });
});


