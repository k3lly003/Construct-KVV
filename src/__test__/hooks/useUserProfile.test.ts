import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useUserProfile } from '@/app/hooks/useUserProfile';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

describe('useUserProfile', () => {
  const mockUserProfile = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '250791322102',
    profilePicture: '/images/profile.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('Fetch user profile', () => {
    test('fetches user profile successfully', async () => {
      // Arrange
      localStorage.setItem('token', 'mock-token');
      mockedAxios.get.mockResolvedValueOnce({
        data: mockUserProfile,
      });

      // Act
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.userProfile).toEqual(mockUserProfile);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/user/me'),
        {
          headers: {
            Authorization: 'Bearer mock-token',
          },
        }
      );
    });

    test('handles fetch profile errors', async () => {
      // Arrange
      localStorage.setItem('token', 'mock-token');
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      // Act
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });

    test('throws error when no token', async () => {
      // Arrange
      localStorage.removeItem('token');

      // Act
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('Update user profile', () => {
    test('updates user profile successfully', async () => {
      // Arrange
      localStorage.setItem('token', 'mock-token');
      const updatedProfile = { ...mockUserProfile, firstName: 'Jane' };
      mockedAxios.patch.mockResolvedValueOnce({
        data: updatedProfile,
      });

      // Act
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateProfile({ firstName: 'Jane' });
      });

      // Assert
      await waitFor(() => {
        expect(mockedAxios.patch).toHaveBeenCalledWith(
          expect.stringContaining('/user/me'),
          expect.any(FormData),
          {
            headers: {
              Authorization: 'Bearer mock-token',
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      });
    });

    test('handles update profile without token', async () => {
      // Arrange
      localStorage.removeItem('token');

      // Act
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateProfile({ firstName: 'Jane' });
      });

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    test('shows updating state during profile update', async () => {
      // Arrange
      localStorage.setItem('token', 'mock-token');
      mockedAxios.patch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockUserProfile }), 100))
      );

      // Act
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateProfile({ firstName: 'Jane' });
      });

      // Assert
      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });
  });
});


