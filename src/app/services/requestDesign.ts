import api from '@/lib/axios';
import axios from 'axios';
import { RAILWAY_API_URL } from '@/lib/apiConfig';

export interface DesignRequest {
  id: string;
  portfolioId: string;
  customerId: string;
  architectId: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  architect?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
}

export interface CreateDesignRequestData {
  portfolioId: string;
}

export interface DesignRequestFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export const requestDesign = {
  // Create a new design request (uses Railway for email notifications)
  async createDesignRequest(data: CreateDesignRequestData): Promise<DesignRequest> {
    // Use Railway for email-sending endpoint
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await axios.post(`${RAILWAY_API_URL}/api/v1/design-requests`, data, { headers });
    return response.data as DesignRequest;
  },

  // Get a single design request by ID
  async getDesignRequestById(id: string): Promise<DesignRequest> {
    const response = await api.get(`/api/v1/design-requests/${id}`);
    return response.data as DesignRequest;
  },

  // Get design requests for logged-in architect
  async getArchitectRequests(filters?: DesignRequestFilters): Promise<DesignRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const response = await api.get(`/api/v1/design-requests/architects/me?${params.toString()}`);
    return response.data as DesignRequest[];
  },

  // Get design requests for logged-in customer
  async getCustomerRequests(filters?: DesignRequestFilters): Promise<DesignRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/v1/customers/me/design-requests?${params.toString()}`);
    return response.data as DesignRequest[];
  }
};