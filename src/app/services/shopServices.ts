import { Shop } from '@/types/shop';
import axios from 'axios';
import dotenv from "dotenv";
import { toast } from 'sonner';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ShopService = {
  async createShop(formData: FormData, authToken: string): Promise<Shop> {
    try {
      const response = await axios.post(`${API_URL}/api/v1/shops`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  },

  async getAllShops(): Promise<Shop[]> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/shops?page=1&limit=10&active=true&sort=createdAt&order=desc`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
      }
      throw error;
    }
  },

  async getShopById(id: string): Promise<Shop> { 
    try {
      const response = await axios.get(`${API_URL}/api/v1/shops/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shop by id:', error);
      throw error;
    }
  },

  async getShopBySlug(slug: string): Promise<Shop> { 
    try {
      const response = await axios.get(`${API_URL}/api/v1/shops/slug/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shop by slug:', error);
      throw error;
    }
  },

  async getMyShop(authToken: string): Promise<Shop> { 
    try {
      const response = await axios.get(`${API_URL}/api/v1/shops/my-shops?page=1&limit=10&active=true&sort=createdAt&order=desc`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching my shop:', error);
      throw error;
    }
  },

  async updateShop(id: string, formData: FormData, authToken: string): Promise<Shop> {
    try {
      const response = await axios.put(`${API_URL}/api/v1/shops/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        }
      });
      toast.success('Shop updated successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw error;
    }
  },

  async deleteCategory(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/shops/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      toast.success('Shop deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};