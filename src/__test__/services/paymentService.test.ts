import { initiateSplitPayment } from '@/app/services/paymentService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaymentService', () => {
  const mockPaymentParams = {
    sellerId: 'seller-1',
    paymentType: 'card',
    tx_ref: 'tx-123456',
    amount: 100000,
    currency: 'RWF',
    redirect_url: 'https://www.constructkvv.com/payment-complete',
    order_id: 'order-1',
    email: 'test@example.com',
    phone_number: '250791322102',
    narration: 'Payment for order order-1',
    token: 'mock-auth-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('initiateSplitPayment', () => {
    test('initiates split payment successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            payment_url: 'https://payment.example.com/checkout',
            tx_ref: 'tx-123456',
          },
        },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await initiateSplitPayment(mockPaymentParams);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/payment/initiate-split'),
        {
          sellerId: 'seller-1',
          paymentType: 'card',
          payload: {
            tx_ref: 'tx-123456',
            amount: 100000,
            currency: 'RWF',
            redirect_url: 'https://www.constructkvv.com/payment-complete',
            order_id: 'order-1',
            email: 'test@example.com',
            phone_number: '250791322102',
            narration: 'Payment for order order-1',
          },
        },
        {
          headers: {
            accept: '*/*',
            Authorization: 'Bearer mock-auth-token',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('initiates payment with customizations', async () => {
      // Arrange
      const customizations = {
        title: 'Construction KVV',
        description: 'Payment for construction materials',
        logo: 'https://example.com/logo.png',
      };
      const mockResponse = {
        data: {
          success: true,
          data: { payment_url: 'https://payment.example.com' },
        },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await initiateSplitPayment({
        ...mockPaymentParams,
        customizations,
      });

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          payload: expect.objectContaining({
            customizations,
          }),
        }),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('uses default currency when not provided', async () => {
      // Arrange
      const mockResponse = {
        data: { success: true },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      await initiateSplitPayment({
        ...mockPaymentParams,
        currency: undefined,
      });

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          payload: expect.objectContaining({
            currency: 'RWF',
          }),
        }),
        expect.any(Object)
      );
    });

    test('uses default redirect URL when not provided', async () => {
      // Arrange
      const mockResponse = {
        data: { success: true },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      await initiateSplitPayment({
        ...mockPaymentParams,
        redirect_url: undefined,
      });

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          payload: expect.objectContaining({
            redirect_url: 'https://www.constructkvv.com/payment-complete',
          }),
        }),
        expect.any(Object)
      );
    });

    test('handles payment initiation errors', async () => {
      // Arrange
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Invalid payment parameters' },
        },
      });

      // Act & Assert
      await expect(initiateSplitPayment(mockPaymentParams)).rejects.toThrow();
    });

    test('handles network errors', async () => {
      // Arrange
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(initiateSplitPayment(mockPaymentParams)).rejects.toThrow('Network error');
    });
  });
});


