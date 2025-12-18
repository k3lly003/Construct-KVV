import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCustomerProfile } from '@/app/hooks/useCustomerProfile';
import { customerProfileService } from '@/app/services/customerProfileServices';

// Mock customerProfileService
jest.mock('@/app/services/customerProfileServices', () => ({
  customerProfileService: {
    getMyProfile: jest.fn(),
    updateMyProfile: jest.fn(),
  },
}));

// Helper to create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCustomerProfile', () => {
  const mockProfile = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '250791322102',
    profilePic: '/images/profile.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Fetch profile', () => {
    test('fetches customer profile successfully after token delay', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (customerProfileService.getMyProfile as jest.Mock).mockResolvedValue(mockProfile);

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      // Initially should not be ready
      expect(result.current.isLoading).toBe(true);

      // Fast-forward time to trigger token ready
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.profile).toEqual(mockProfile);
      expect(customerProfileService.getMyProfile).toHaveBeenCalledWith('mock-token');
    });

    test('does not fetch profile when no token', async () => {
      // Arrange
      localStorage.clear();

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(customerProfileService.getMyProfile).not.toHaveBeenCalled();
      expect(result.current.profile).toBeNull();
    });

    test('handles profile fetch errors', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const error = new Error('Failed to fetch profile');
      (customerProfileService.getMyProfile as jest.Mock).mockRejectedValue(error);

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });

    test('retries on credential errors', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const credentialError = new Error('Invalid credentials');
      (customerProfileService.getMyProfile as jest.Mock)
        .mockRejectedValueOnce(credentialError)
        .mockResolvedValue(mockProfile);

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 5000 });
    });
  });

  describe('Update profile', () => {
    test('updates profile successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const updatedProfile = { ...mockProfile, firstName: 'Jane' };
      const formData = new FormData();
      (customerProfileService.updateMyProfile as jest.Mock).mockResolvedValue(updatedProfile);

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateProfile(formData);
      });

      // Assert
      await waitFor(() => {
        expect(customerProfileService.updateMyProfile).toHaveBeenCalledWith(formData, 'mock-token');
      });
    });

    test('handles update profile without authentication', async () => {
      // Arrange
      localStorage.removeItem('authToken');
      const formData = new FormData();

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateProfile(formData);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    test('shows updating state during profile update', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const formData = new FormData();
      (customerProfileService.updateMyProfile as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockProfile), 100))
      );

      // Act
      const { result } = renderHook(() => useCustomerProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateProfile(formData);
      });

      // Assert
      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });
  });
});


