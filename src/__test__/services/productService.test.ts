import { productService } from '@/app/services/productServices';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProductService', () => {
  const mockProduct = {
    id: 'product-1',
    name: 'Cement 50kg',
    description: 'High quality construction cement',
    price: '50000',
    stock: 10,
    categoryId: 'cat-1',
    slug: 'cement-50kg',
  };

  const mockProducts = [mockProduct];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('getAllProducts', () => {
    test('fetches all products successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: mockProducts,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.getAllProducts();

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.any(Object)
      );
      expect(result).toEqual(mockProducts);
    });

    test('handles fetch products errors', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(productService.getAllProducts()).rejects.toThrow();
    });

    test('returns empty array when response data is not an array', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: null,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.getAllProducts();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('createProduct', () => {
    test('creates product successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const formData = new FormData();
      const mockResponse = {
        data: {
          success: true,
          data: mockProduct,
        },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.createProduct(formData, authToken);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(mockProduct);
    });

    test('handles create product errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      const formData = new FormData();
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Validation error' },
        },
      });

      // Act & Assert
      await expect(productService.createProduct(formData, authToken)).rejects.toThrow();
    });
  });

  describe('getProductById', () => {
    test('fetches product by ID successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: mockProduct,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.getProductById('product-1');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products/product-1')
      );
      expect(result).toEqual(mockProduct);
    });

    test('handles get product by ID errors', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Product not found' },
        },
      });

      // Act & Assert
      await expect(productService.getProductById('invalid-id')).rejects.toThrow();
    });
  });

  describe('updateProduct', () => {
    test('updates product successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const formData = new FormData();
      const updatedProduct = { ...mockProduct, name: 'Updated Cement' };
      const mockResponse = {
        data: updatedProduct,
      };
      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.updateProduct('product-1', formData, authToken);

      // Assert
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/products/product-1'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(updatedProduct);
    });

    test('handles update product errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      const formData = new FormData();
      mockedAxios.put.mockRejectedValueOnce({
        response: {
          status: 403,
          data: { message: 'Unauthorized' },
        },
      });

      // Act & Assert
      await expect(
        productService.updateProduct('product-1', formData, authToken)
      ).rejects.toThrow();
    });
  });

  describe('deleteProduct', () => {
    test('deletes product successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      mockedAxios.delete.mockResolvedValueOnce({});

      // Act
      await productService.deleteProduct('product-1', authToken);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/products/product-1'),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    });

    test('handles delete product errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      mockedAxios.delete.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Product not found' },
        },
      });

      // Act & Assert
      await expect(productService.deleteProduct('invalid-id', authToken)).rejects.toThrow();
    });
  });

  describe('getProductBySlug', () => {
    test('fetches product by slug successfully', async () => {
      // Arrange
      const mockResponse = {
        data: mockProduct,
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.getProductBySlug('cement-50kg');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products/slug/cement-50kg')
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getProductsBySellerId', () => {
    test('fetches products by seller ID successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const mockResponse = {
        data: {
          data: mockProducts,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.getProductsBySellerId('seller-1', authToken);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products/seller/seller-1'),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getMyProducts', () => {
    test('fetches authenticated seller products successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const mockResponse = {
        data: {
          data: mockProducts,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.getMyProducts(authToken, 1, 10);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products/seller/my-products'),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(mockProducts);
    });
  });

  describe('searchProducts', () => {
    test('searches products with filters successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: mockProducts,
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await productService.searchProducts({
        search: 'cement',
        category: 'construction',
        page: 1,
        limit: 10,
      });

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});


