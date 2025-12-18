import { orderService } from '@/app/services/orderService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrderService', () => {
  const mockToken = 'mock-auth-token';
  const mockOrder = {
    id: 'order-1',
    cartId: 'cart-1',
    total: 100000,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('placeOrder', () => {
    test('places order successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: mockOrder,
        },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await orderService.placeOrder('cart-1', 'payment-intent-1', mockToken);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        {
          cartId: 'cart-1',
          paymentIntent: 'payment-intent-1',
        },
        {
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('handles place order errors', async () => {
      // Arrange
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Cart is empty' },
        },
      });

      // Act & Assert
      await expect(
        orderService.placeOrder('cart-1', 'payment-intent-1', mockToken)
      ).rejects.toThrow();
    });
  });

  describe('getMyOrders', () => {
    test('fetches user orders successfully', async () => {
      // Arrange
      const mockOrders = [mockOrder];
      const mockResponse = {
        data: {
          success: true,
          data: mockOrders,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await orderService.getMyOrders(mockToken, 1, 10, 'createdAt', 'desc');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/orders/my-orders'),
        {
          params: {
            page: 1,
            limit: 10,
            sort: 'createdAt',
            order: 'desc',
          },
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('handles get my orders errors', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      });

      // Act & Assert
      await expect(orderService.getMyOrders(mockToken)).rejects.toThrow();
    });
  });

  describe('updateOrderStatus', () => {
    test('updates order status successfully', async () => {
      // Arrange
      const updatedOrder = {
        ...mockOrder,
        status: 'PAID',
      };
      const mockResponse = {
        data: {
          success: true,
          data: updatedOrder,
        },
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await orderService.updateOrderStatus('order-1', 'PAID', mockToken);

      // Assert
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/order-1/status'),
        { status: 'PAID' },
        {
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('handles update order status errors', async () => {
      // Arrange
      mockedAxios.patch.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Order not found' },
        },
      });

      // Act & Assert
      await expect(
        orderService.updateOrderStatus('invalid-order', 'PAID', mockToken)
      ).rejects.toThrow();
    });
  });
});


