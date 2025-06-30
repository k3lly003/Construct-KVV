import { Service } from '@/types/service';
import axios from 'axios';
import dotenv from "dotenv";
import { toast } from 'sonner';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const serviceService = {
  async createService(shopId: string, service: Omit<Service, 'id' | 'createdAt'>, authToken: string): Promise<Service> {
    try {
      const response = await axios.post(`${API_URL}/api/v1/services/shop/${shopId}`, service, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      console.log("CREATED-SERVICE-DATA",response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  async getServices(): Promise<Service[]> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/services`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
      }
      throw error;
    }
  },

  async getServiceById(id: string): Promise<Service> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/services/${id}`);
      return response.data.data;
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
      return response.data.data;
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