import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCategories } from '@/app/hooks/useCategories';
import { categoryService } from '@/app/services/categoryServices';

// Mock categoryService
jest.mock('@/app/services/categoryServices', () => ({
  categoryService: {
    getCategories: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    getCategoryById: jest.fn(),
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

describe('useCategories', () => {
  const mockCategories = [
    {
      id: 'cat-1',
      name: 'Construction Materials',
      description: 'Building materials',
      slug: 'construction-materials',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getCategories', () => {
    test('fetches categories successfully', async () => {
      // Arrange
      (categoryService.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      // Act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.categories).toEqual(mockCategories);
      expect(categoryService.getCategories).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    test('creates category with subcategories successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const parentCategory = { id: 'cat-1', name: 'Construction' };
      (categoryService.createCategory as jest.Mock)
        .mockResolvedValueOnce(parentCategory)
        .mockResolvedValue({ id: 'sub-1', name: 'Cement' })
        .mockResolvedValue({ id: 'sub-2', name: 'Steel' });

      // Act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createCategory('Construction', 'Building materials', [
          'Cement',
          'Steel',
        ]);
      });

      // Assert
      await waitFor(() => {
        expect(categoryService.createCategory).toHaveBeenCalled();
      });
    });

    test('handles create category without authentication', async () => {
      // Arrange
      localStorage.removeItem('authToken');

      // Act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await expect(
          result.current.createCategory('Construction', 'Building materials', [])
        ).rejects.toThrow('Not authenticated');
      });
    });
  });

  describe('deleteCategory', () => {
    test('deletes category successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (categoryService.deleteCategory as jest.Mock).mockResolvedValue(undefined);

      // Act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteCategory('cat-1');
      });

      // Assert
      await waitFor(() => {
        expect(categoryService.deleteCategory).toHaveBeenCalledWith('cat-1', 'mock-token');
      });
    });
  });

  describe('updateCategory', () => {
    test('updates category successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      const updatedCategory = { ...mockCategories[0], name: 'Updated Construction' };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(updatedCategory);

      // Act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateCategory('cat-1', { name: 'Updated Construction' });
      });

      // Assert
      await waitFor(() => {
        expect(categoryService.updateCategory).toHaveBeenCalledWith(
          'cat-1',
          { name: 'Updated Construction' },
          'mock-token'
        );
      });
    });
  });

  describe('getCategoryById', () => {
    test('gets category by ID successfully', async () => {
      // Arrange
      localStorage.setItem('authToken', 'mock-token');
      (categoryService.getCategoryById as jest.Mock).mockResolvedValue(mockCategories[0]);

      // Act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.getCategoryById('cat-1');
      });

      // Assert
      await waitFor(() => {
        expect(categoryService.getCategoryById).toHaveBeenCalledWith('cat-1', 'mock-token');
      });
    });
  });
});


