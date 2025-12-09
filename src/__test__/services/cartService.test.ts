import { cartService } from '@/app/services/cartService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CartService', () => {
  const mockToken = 'mock-auth-token';
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
    localStorage.clear();
    localStorage.setItem('authToken', mockToken);
  });

  describe('addToCart', () => {
    test('adds item to cart successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: mockCart,
        },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await cartService.addToCart('product-1', 2);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/cart'),
        { productId: 'product-1', quantity: 2 },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('handles add to cart errors', async () => {
      // Arrange
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Product not found' },
        },
      });

      // Act & Assert
      await expect(cartService.addToCart('invalid-product', 1)).rejects.toThrow(
        'Product not found'
      );
    });

    test('throws error when no auth token', async () => {
      // Arrange
      localStorage.removeItem('authToken');

      // Act & Assert
      await expect(cartService.addToCart('product-1', 1)).rejects.toThrow(
        'No authentication token found'
      );
    });
  });

  describe('getCart', () => {
    test('fetches cart successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: mockCart,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await cartService.getCart();

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/cart'), {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('handles fetch cart errors', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Cart not found' },
        },
      });

      // Act & Assert
      await expect(cartService.getCart()).rejects.toThrow('Cart not found');
    });
  });

  describe('updateCartItem', () => {
    test('updates cart item quantity successfully', async () => {
      // Arrange
      const updatedCart = {
        ...mockCart,
        items: [
          {
            ...mockCart.items[0],
            quantity: 3,
            subtotal: 150000,
          },
        ],
      };
      const mockResponse = {
        data: {
          success: true,
          data: updatedCart,
        },
      };
      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await cartService.updateCartItem('cart-item-1', 3);

      // Assert
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/cart/items/cart-item-1'),
        { quantity: 3 },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('handles update cart item errors', async () => {
      // Arrange
      mockedAxios.put.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Invalid quantity' },
        },
      });

      // Act & Assert
      await expect(cartService.updateCartItem('cart-item-1', -1)).rejects.toThrow(
        'Invalid quantity'
      );
    });
  });

  describe('removeFromCart', () => {
    test('removes item from cart successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            ...mockCart,
            items: [],
          },
        },
      };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await cartService.removeFromCart('cart-item-1');

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/cart/items/cart-item-1'),
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('handles remove from cart errors', async () => {
      // Arrange
      mockedAxios.delete.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Cart item not found' },
        },
      });

      // Act & Assert
      await expect(cartService.removeFromCart('invalid-item')).rejects.toThrow(
        'Cart item not found'
      );
    });
  });

  describe('clearCart', () => {
    test('clears cart by removing all items', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: mockCart,
        },
      });
      mockedAxios.delete.mockResolvedValueOnce({
        data: {
          success: true,
          data: { ...mockCart, items: [] },
        },
      });

      // Act
      await cartService.clearCart();

      // Assert
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1); // One item to remove
    });

    test('handles clear cart errors', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      });

      // Act & Assert
      await expect(cartService.clearCart()).rejects.toThrow('Failed to clear cart');
    });
  });

  describe('getCartItemCount', () => {
    test('returns correct cart item count', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: mockCart,
        },
      });

      // Act
      const count = await cartService.getCartItemCount();

      // Assert
      expect(count).toBe(2);
    });

    test('returns 0 on error', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      // Act
      const count = await cartService.getCartItemCount();

      // Assert
      expect(count).toBe(0);
    });
  });
});


