import { customerProfileService } from '@/app/services/customerProfileServices';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('CustomerProfileService', () => {
  const mockCustomer = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '250791322102',
    profilePic: '/images/profile.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('getMyProfile', () => {
    test('fetches customer profile successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockCustomer },
      });

      // Act
      const result = await customerProfileService.getMyProfile(authToken);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/user/me'),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(mockCustomer);
    });

    test('handles 401 unauthorized error', async () => {
      // Arrange
      const authToken = 'invalid-token';
      const { toast } = require('sonner');
      mockedAxios.get.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        message: 'Unauthorized',
      });

      // Act & Assert
      await expect(customerProfileService.getMyProfile(authToken)).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith(
        'Your session has expired. Please login again.'
      );
    });

    test('handles 404 not found error', async () => {
      // Arrange
      const authToken = 'mock-token';
      const { toast } = require('sonner');
      mockedAxios.get.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Profile not found' },
        },
        message: 'Profile not found',
      });

      // Act & Assert
      await expect(customerProfileService.getMyProfile(authToken)).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith(
        'Profile not found. Please complete your profile setup.'
      );
    });

    test('handles 500 server error', async () => {
      // Arrange
      const authToken = 'mock-token';
      const { toast } = require('sonner');
      mockedAxios.get.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
        message: 'Server error',
      });

      // Act & Assert
      await expect(customerProfileService.getMyProfile(authToken)).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith('Server error. Please try again later.');
    });

    test('handles network errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      const { toast } = require('sonner');
      const networkError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(customerProfileService.getMyProfile(authToken)).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith(
        'Network error. Please check your connection and try again.'
      );
    });
  });

  describe('updateMyProfile', () => {
    test('updates customer profile successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const formData = new FormData();
      const updatedCustomer = { ...mockCustomer, firstName: 'Jane' };
      mockedAxios.patch.mockResolvedValueOnce({
        data: { data: updatedCustomer },
      });

      // Act
      const result = await customerProfileService.updateMyProfile(formData, authToken);

      // Assert
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/user/me'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(updatedCustomer);
    });

    test('handles update profile errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      const formData = new FormData();
      mockedAxios.patch.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Validation error' },
        },
        message: 'Validation error',
      });

      // Act & Assert
      await expect(
        customerProfileService.updateMyProfile(formData, authToken)
      ).rejects.toThrow();
    });
  });
});


