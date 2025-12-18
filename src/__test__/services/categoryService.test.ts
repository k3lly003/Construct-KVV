import { categoryService } from '@/app/services/categoryServices';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CategoryService', () => {
  const mockCategory = {
    id: 'cat-1',
    name: 'Construction Materials',
    description: 'Building materials and supplies',
    slug: 'construction-materials',
    parentId: '',
    dateCreated: new Date().toISOString(),
  };

  const mockCategories = [mockCategory];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('createCategory', () => {
    test('creates category successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const categoryData = {
        name: 'Construction Materials',
        description: 'Building materials',
        slug: 'construction-materials',
        parentId: '',
        dateCreated: new Date().toISOString(),
      };
      mockedAxios.post.mockResolvedValueOnce({
        data: mockCategory,
      });

      // Act
      const result = await categoryService.createCategory(categoryData, authToken);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/categories'),
        categoryData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(mockCategory);
    });

    test('handles create category errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      const categoryData = {
        name: 'Construction Materials',
        description: 'Building materials',
        slug: 'construction-materials',
        parentId: '',
        dateCreated: new Date().toISOString(),
      };
      mockedAxios.post.mockRejectedValueOnce(new Error('Validation error'));

      // Act & Assert
      await expect(
        categoryService.createCategory(categoryData, authToken)
      ).rejects.toThrow('Validation error');
    });

    test('throws error for invalid response data', async () => {
      // Arrange
      const authToken = 'mock-token';
      const categoryData = {
        name: 'Construction Materials',
        description: 'Building materials',
        slug: 'construction-materials',
        parentId: '',
        dateCreated: new Date().toISOString(),
      };
      mockedAxios.post.mockResolvedValueOnce({
        data: { invalid: 'data' },
      });

      // Act & Assert
      await expect(
        categoryService.createCategory(categoryData, authToken)
      ).rejects.toThrow('Invalid response data');
    });
  });

  describe('getCategories', () => {
    test('fetches categories successfully', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockCategories },
      });

      // Act
      const result = await categoryService.getCategories();

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/categories')
      );
      expect(result).toEqual(mockCategories);
    });

    test('handles fetch categories errors', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      });

      // Act & Assert
      await expect(categoryService.getCategories()).rejects.toThrow();
    });

    test('throws error for invalid response structure', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: { invalid: 'structure' },
      });

      // Act & Assert
      await expect(categoryService.getCategories()).rejects.toThrow('Invalid response data');
    });
  });

  describe('deleteCategory', () => {
    test('deletes category successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      mockedAxios.delete.mockResolvedValueOnce({});

      // Act
      await categoryService.deleteCategory('cat-1', authToken);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/categories/cat-1'),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    });

    test('handles delete category errors', async () => {
      // Arrange
      const authToken = 'mock-token';
      mockedAxios.delete.mockRejectedValueOnce(new Error('Not found'));

      // Act & Assert
      await expect(categoryService.deleteCategory('invalid-id', authToken)).rejects.toThrow();
    });
  });

  describe('getCategoryById', () => {
    test('fetches category by ID successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockCategory },
      });

      // Act
      const result = await categoryService.getCategoryById('cat-1', authToken);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/categories/cat-1'),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(mockCategory);
    });
  });

  describe('updateCategory', () => {
    test('updates category successfully', async () => {
      // Arrange
      const authToken = 'mock-token';
      const updates = { name: 'Updated Construction Materials' };
      const updatedCategory = { ...mockCategory, ...updates };
      mockedAxios.put.mockResolvedValueOnce({
        data: { data: updatedCategory },
      });

      // Act
      const result = await categoryService.updateCategory('cat-1', updates, authToken);

      // Assert
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/categories/cat-1'),
        updates,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      expect(result).toEqual(updatedCategory);
    });
  });
});


