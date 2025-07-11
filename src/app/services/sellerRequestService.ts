import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SellerRequestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

export interface SellerRequest {
  id: string;
  userId: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  taxId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: SellerRequestUser;
}

export const SellerRequestService = {
  async getAllRequests(authToken?: string): Promise<SellerRequest[]> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    const response = await axios.get(`${API_URL}/api/v1/seller/requests`, { headers });
    const data = response.data;
    if (Array.isArray(data.data)) {
      return data.data as SellerRequest[];
    } else {
      throw new Error('Unexpected response format when fetching seller requests');
    }
  },

  async updateRequestStatus(id: string, status: 'APPROVED' | 'REJECTED', authToken?: string): Promise<void> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    await axios.put(`${API_URL}/api/v1/seller/${id}/status`, { status }, { headers });
  },
}; 