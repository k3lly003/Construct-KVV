import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useShop } from '@/app/hooks/useShop';
import { ShopService } from '@/app/services/shopServices';

// Mock ShopService
jest.mock('@/app/services/shopServices', () => ({
  ShopService: {
    createShop: jest.fn(),
    updateShop: jest.fn(),
    getMyShop: jest.fn(),
    getAllShops: jest.fn(),
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

describe('useShop', () => {
  const mockShop = {
    id: 'shop-1',
    name: 'Construction Supplies Shop',
    description: 'Quality construction materials',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getMyShop', () => {
    test('fetches authenticated user shop successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (ShopService.getMyShop as jest.Mock).mockResolvedValue(mockShop);

      // Act
      const { result } = renderHook(() => useShop(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isMyShopLoading).toBe(false);
      });

      expect(result.current.myShop).toEqual(mockShop);
      expect(ShopService.getMyShop).toHaveBeenCalledWith('mock-token');
    });

    test('returns null when shop not found (404)', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      (ShopService.getMyShop as jest.Mock).mockRejectedValue(axiosError);

      // Act
      const { result } = renderHook(() => useShop(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isMyShopLoading).toBe(false);
      });

      expect(result.current.myShop).toBeNull();
    });
  });

  describe('getAllShops', () => {
    test('fetches all shops successfully', async () => {
      // Arrange
      const mockShops = [mockShop];
      (ShopService.getAllShops as jest.Mock).mockResolvedValue(mockShops);

      // Act
      const { result } = renderHook(() => useShop(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.areShopsLoading).toBe(false);
      });

      expect(result.current.shops).toEqual(mockShops);
      expect(ShopService.getAllShops).toHaveBeenCalled();
    });
  });

  describe('createShop', () => {
    test('creates shop successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const formData = new FormData();
      (ShopService.createShop as jest.Mock).mockResolvedValue(mockShop);

      // Act
      const { result } = renderHook(() => useShop(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isMyShopLoading).toBe(false);
      });

      await act(async () => {
        result.current.createShop(formData);
      });

      // Assert
      await waitFor(() => {
        expect(ShopService.createShop).toHaveBeenCalledWith(formData, 'mock-token');
      });
    });

    test('handles create shop without authentication', async () => {
      // Arrange
      localStorage.removeItem('authToken');
      const formData = new FormData();

      // Act
      const { result } = renderHook(() => useShop(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isMyShopLoading).toBe(false);
      });

      await act(async () => {
        result.current.createShop(formData);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.createError).toBeDefined();
      });
    });
  });

  describe('updateShop', () => {
    test('updates shop successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const formData = new FormData();
      const updatedShop = { ...mockShop, name: 'Updated Shop' };
      (ShopService.updateShop as jest.Mock).mockResolvedValue(updatedShop);

      // Act
      const { result } = renderHook(() => useShop(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isMyShopLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateShop({ id: 'shop-1', data: formData });
      });

      // Assert
      await waitFor(() => {
        expect(ShopService.updateShop).toHaveBeenCalledWith('shop-1', formData, 'mock-token');
      });
    });
  });
});

// Import act
import { act } from '@testing-library/react';


