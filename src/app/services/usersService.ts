import { User } from '@/types/user';
import api from '@/lib/axios';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UsersResponse {
  success: boolean;
  data: { users: User[]; pagination?: { total: number; page: number; limit: number; pages: number } };
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const UsersService = {
  async getAllUsers(authToken?: string, page = 1, limit = 10, search = '', role = '', isActive?: boolean): Promise<{ users: User[]; meta?: any }> {
    try {
      // Build URL using provided pagination params
      let url = `${API_URL}/api/v1/user/all?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (role) url += `&role=${encodeURIComponent(role)}`;
      if (isActive !== undefined) url += `&isActive=${isActive}`;
      // Use shared axios instance which auto-attaches Authorization from storage
      // If an explicit token is provided, set it on the fly
      const response = await api.get(url, authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined);
      const data: any = response.data;
      // Debug: inspect raw shape
      if (typeof window !== 'undefined') {
        console.log('[UsersService.getAllUsers] raw response:', data);
      }

      // Accept multiple possible shapes gracefully
      const users: User[] =
        (data?.data?.users as User[] | undefined) ??
        (data?.users as User[] | undefined) ??
        (Array.isArray(data?.data) ? (data.data as User[]) : undefined) ??
        (Array.isArray(data) ? (data as User[]) : []);

      const pagination = data?.data?.pagination || data?.meta || {};
      const meta = {
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.pages ?? pagination.totalPages,
      };

      return { users, meta };
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async updateUserStatus(userId: string, isActive: boolean, authToken: string): Promise<User> {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const response = await axios.patch(`${API_URL}/api/v1/user/${userId}/status`, { isActive }, { headers });
      return response.data as User;
    } catch (error: unknown) {
      console.error('Error updating user status:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },
  // Add more user-related methods as needed
}; 