import { Service } from '@/types/service';
import axios from 'axios';
import dotenv from "dotenv";
import { toast } from 'sonner';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const serviceService = {
  async createService(shopId: string, formData: FormData, authToken: string): Promise<Service> {
    try {
      const response = await axios.post(`${API_URL}/api/v1/services/shop/${shopId}`, formData, {
        headers: {
          //'Content-Type': 'multipart/form-data', // Let browser set this
          'Authorization': `Bearer ${authToken}`
        },
      });
      console.log("CREATED-SERVICE-DATA",response.data);
      return response.data as Service;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  async getServices(): Promise<Service[]> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/services`);
      // Handle both direct array response and nested data response
      const data: unknown = response.data;
      if (Array.isArray(data)) {
        return data as Service[];
      } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
        return (data as { data: Service[] }).data;
      } else {
        console.warn('Unexpected response format when fetching services:', data);
        return [];
      }
    } catch (error: unknown) {
      console.error('Error fetching services:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getServicesByShopId(shopId: string): Promise<Service[]> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/services?shopId=${shopId}&page=1&limit=100&active=true`);
      // Handle both direct array response and nested data response
      const data: unknown = response.data;
      if (Array.isArray(data)) {
        return data as Service[];
      } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
        return (data as { data: Service[] }).data;
      } else {
        throw new Error('Unexpected response format when fetching services by shop ID');
      }
    } catch (error: unknown) {
      console.error('Error fetching services by shop ID:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getServiceById(id: string): Promise<Service> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/services/${id}`);
      return response.data as Service;
    } catch (error) {
      console.error('Error fetching service by id:', error);
      throw error;
    }
  },

  async updateService(id: string, service: Omit<Service, 'id' | 'createdAt'>, authToken: string): Promise<Service> {
    try {
      const response = await axios.put(`${API_URL}/api/v1/services/${id}`, service, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      toast.success("Service updated successfully!");
      return response.data as Service;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  async deleteService(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/services/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}; 