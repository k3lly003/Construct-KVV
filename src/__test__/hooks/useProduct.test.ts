import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProducts } from '@/app/hooks/useProduct';
import { productService } from '@/app/services/productServices';

// Mock productService
jest.mock('@/app/services/productServices', () => ({
  productService: {
    getAllProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getProductById: jest.fn(),
    getProductBySlug: jest.fn(),
    getProductsBySellerId: jest.fn(),
    getMyProducts: jest.fn(),
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
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

describe('useProducts', () => {
  const mockProducts = [
    {
      id: 'product-1',
      name: 'Cement 50kg',
      description: 'High quality cement',
      price: '50000',
      stock: 10,
      categoryId: 'cat-1',
    },
    {
      id: 'product-2',
      name: 'Steel Bars',
      description: 'Construction steel',
      price: '30000',
      stock: 5,
      categoryId: 'cat-2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Fetch products', () => {
    test('fetches all products successfully', async () => {
      // Arrange
      (productService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
      localStorage.setItem('authToken', 'mock-token');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(productService.getAllProducts).toHaveBeenCalled();
    });

    test('handles fetch products error', async () => {
      // Arrange
      const error = new Error('Failed to fetch products');
      (productService.getAllProducts as jest.Mock).mockRejectedValue(error);

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('Create product', () => {
    test('creates product successfully', async () => {
      // Arrange
      const { toast } = require('sonner');
      const newProduct = {
        name: 'New Cement',
        price: '60000',
        stock: 20,
      };
      const formData = new FormData();
      (productService.createProduct as jest.Mock).mockResolvedValue(newProduct);
      localStorage.setItem('authToken', 'mock-token');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.createProduct(formData);

      // Assert
      expect(productService.createProduct).toHaveBeenCalledWith(formData, 'mock-token');
      expect(toast.success).toHaveBeenCalledWith('Product created successfully');
    });

    test('handles create product without authentication', async () => {
      // Arrange
      const { toast } = require('sonner');
      localStorage.removeItem('authToken');
      const formData = new FormData();

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.createProduct(formData)).rejects.toThrow('Not authenticated');

      // Assert
      expect(toast.error).toHaveBeenCalledWith('Not authenticated');
    });
  });

  describe('Update product', () => {
    test('updates product successfully', async () => {
      // Arrange
      const { toast } = require('sonner');
      const updatedProduct = {
        id: 'product-1',
        name: 'Updated Cement',
        price: '55000',
      };
      const formData = new FormData();
      (productService.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);
      localStorage.setItem('authToken', 'mock-token');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.updateProduct('product-1', formData);

      // Assert
      expect(productService.updateProduct).toHaveBeenCalledWith('product-1', formData, 'mock-token');
      expect(toast.success).toHaveBeenCalledWith('Product updated successfully');
    });

    test('handles update product without authentication', async () => {
      // Arrange
      const { toast } = require('sonner');
      localStorage.removeItem('authToken');
      const formData = new FormData();

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.updateProduct('product-1', formData)
      ).rejects.toThrow('Not authenticated');

      // Assert
      expect(toast.error).toHaveBeenCalledWith('Not authenticated');
    });
  });

  describe('Delete product', () => {
    test('deletes product successfully', async () => {
      // Arrange
      const { toast } = require('sonner');
      (productService.deleteProduct as jest.Mock).mockResolvedValue(undefined);
      localStorage.setItem('authToken', 'mock-token');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.deleteProduct('product-1');

      // Assert
      expect(productService.deleteProduct).toHaveBeenCalledWith('product-1', 'mock-token');
      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully');
    });

    test('handles delete product without authentication', async () => {
      // Arrange
      localStorage.removeItem('authToken');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.deleteProduct('product-1')).rejects.toThrow('Not authenticated');
    });
  });

  describe('Get product by ID', () => {
    test('gets product by ID successfully', async () => {
      // Arrange
      const product = mockProducts[0];
      (productService.getProductById as jest.Mock).mockResolvedValue(product);

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const fetchedProduct = await result.current.getProductById('product-1');

      // Assert
      expect(productService.getProductById).toHaveBeenCalledWith('product-1');
      expect(fetchedProduct).toEqual(product);
    });
  });

  describe('Get product by slug', () => {
    test('gets product by slug successfully', async () => {
      // Arrange
      const product = mockProducts[0];
      (productService.getProductBySlug as jest.Mock).mockResolvedValue(product);

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const fetchedProduct = await result.current.getProductBySlug('cement-50kg');

      // Assert
      expect(productService.getProductBySlug).toHaveBeenCalledWith('cement-50kg');
      expect(fetchedProduct).toEqual(product);
    });
  });

  describe('Get products by seller ID', () => {
    test('gets products by seller ID successfully', async () => {
      // Arrange
      (productService.getProductsBySellerId as jest.Mock).mockResolvedValue(mockProducts);
      localStorage.setItem('authToken', 'mock-token');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const products = await result.current.getProductsBySellerId('seller-1');

      // Assert
      expect(productService.getProductsBySellerId).toHaveBeenCalledWith('seller-1', 'mock-token');
      expect(products).toEqual(mockProducts);
    });
  });

  describe('Get my products', () => {
    test('gets authenticated seller products successfully', async () => {
      // Arrange
      (productService.getMyProducts as jest.Mock).mockResolvedValue(mockProducts);
      localStorage.setItem('authToken', 'mock-token');

      // Act
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const products = await result.current.getMyProducts(1, 10);

      // Assert
      expect(productService.getMyProducts).toHaveBeenCalledWith('mock-token', 1, 10);
      expect(products).toEqual(mockProducts);
    });
  });
});


