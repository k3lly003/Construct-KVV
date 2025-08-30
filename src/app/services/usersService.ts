import { User } from '@/types/user';
import axios from 'axios';
import dotenv from 'dotenv';
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
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
      let url = `${API_URL}/api/v1/user/all?page=1&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (role) url += `&role=${encodeURIComponent(role)}`;
      if (isActive !== undefined) url += `&isActive=${isActive}`;
      const response = await axios.get(url, { headers });
      const data: any = response.data;
      if (data && typeof data === 'object' && data.data && Array.isArray(data.data.users)) {
        // Extract pagination info
        const pagination = data.data.pagination || {};
        const meta = {
          total: pagination.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: pagination.pages,
        };
        return { users: data.data.users, meta };
      } else {
        throw new Error('Unexpected response format when fetching users');
      }
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