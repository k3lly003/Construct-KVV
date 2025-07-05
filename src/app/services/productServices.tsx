import { Product } from '@/types/product';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<{ data: Product[] }>(`${API_URL}/api/v1/products?page=1&limit=10&active=true&sort=createdAt&order=desc`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async createProduct(formData: FormData, authToken: string): Promise<Product> {
    try {
      // Debug: Log what's being sent
      console.log('=== PRODUCT SERVICE DEBUG ===');
      console.log('API URL:', `${API_URL}/api/v1/products`);
      console.log('Auth Token:', authToken ? 'Present' : 'Missing');
      
      // Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      const response = await axios.post(`${API_URL}/api/v1/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        },
      });
      return response.data as Product;
    } catch (error) {
      console.error('Error creating product:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/products/${id}`);
      return response.data as Product;
    } catch (error: unknown) {
      console.error('Error fetching product by id:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async updateProduct(id: string, formData: FormData, authToken: string): Promise<Product> {
    try {
      const response = await axios.put(`${API_URL}/api/v1/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        }
      });
      return response.data as Product;
    } catch (error: unknown) {
      console.error('Error updating product:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async deleteProduct(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/products/slug/${slug}`);
      return response.data as Product;
    } catch (error: unknown) {
      console.error('Error fetching product by slug:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getProductsBySellerId(sellerId: string, authToken: string): Promise<Product[]> {
    // console.log("777777777",sellerId);
    try {
      const response = await axios.get<{ data: Product[] }>(`${API_URL}/api/v1/products/seller/${sellerId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      // console.log("777777777",sellerId);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      console.error('Error fetching products by seller ID:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}; 