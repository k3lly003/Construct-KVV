import api from '@/lib/axios';
import axios from 'axios';
import { RAILWAY_API_URL } from '@/lib/apiConfig';

export interface ServiceRequest {
  id: string;
  technicianId: string;
  customerId: string;
  category: string;
  description: string;
  location: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  budget: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  technician?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
}

export interface CreateServiceRequestData {
  portfolioId: string;
}

export interface ServiceRequestFilters {
  status?: string;
  category?: string;
  urgency?: string;
  page?: number;
  limit?: number;
}

export interface ServiceRequestResponse {
  data: ServiceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const requestService = {
  // Create a new service request (uses Railway for email notifications)
  async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    // Use Railway for email-sending endpoint
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await axios.post(`${RAILWAY_API_URL}/api/v1/service-requests`, data, { headers });
    return response.data as ServiceRequest;
  },

  // Get a single service request by ID
  async getServiceRequestById(id: string): Promise<ServiceRequest> {
    const response = await api.get(`/api/v1/service-requests/${id}`);
    return response.data as ServiceRequest;
  },

  // Get service requests for logged-in technician
  async getTechnicianRequests(filters?: ServiceRequestFilters): Promise<ServiceRequestResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/v1/service-requests/technician/my-requests?${params.toString()}`);
    return response.data as ServiceRequestResponse;
  },

  // Get service requests for logged-in customer
  async getCustomerRequests(filters?: ServiceRequestFilters): Promise<ServiceRequestResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/v1/service-requests/customer/my-requests?${params.toString()}`);
    return response.data as ServiceRequestResponse;
  },

  // Get all service requests (admin only)
  async getAllServiceRequests(filters?: ServiceRequestFilters): Promise<ServiceRequestResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/v1/service-requests/admin/all?${params.toString()}`);
    return response.data as ServiceRequestResponse;
  },

  // Update service request status
  async updateServiceRequestStatus(id: string, status: ServiceRequest['status']): Promise<ServiceRequest> {
    const response = await api.patch(`/api/v1/service-requests/${id}/status`, { status });
    return response.data as ServiceRequest;
  },

  // Delete service request
  async deleteServiceRequest(id: string): Promise<void> {
    await api.delete(`/api/v1/service-requests/${id}`);
  }
};
