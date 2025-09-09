import api from '@/lib/axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ProfessionalType = 'contractor' | 'architect' | 'technician';

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  workDate: string; // ISO date (YYYY-MM-DD)
  images: string[];
  category: string;
  location: string;
  budget: string;
  duration: string;
  skills: string[];
  clientFeedback?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  contractorId?: string;
  architectId?: string;
  technicianId?: string;
}

export interface PortfolioPayload {
  title: string;
  description: string;
  workDate: string;
  images: string[];
  category: string;
  location: string;
  budget: string;
  duration: string;
  skills: string[];
  clientFeedback?: string;
  isPublic?: boolean; // optional on create
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PublicPortfolioFilters {
  category?: string;
  location?: string;
  professionalType?: ProfessionalType;
  page?: number;
  limit?: number;
}

export const PortfolioService = {
  async createPortfolio(payload: PortfolioPayload, authToken?: string): Promise<ApiEnvelope<Portfolio>> {
    const url = `${API_URL}/api/v1/portfolio`;
    const response = await api.post(url, payload, authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined);
    return response.data as ApiEnvelope<Portfolio>;
  },

  async getPortfolioById(portfolioId: string): Promise<Portfolio | null> {
    const url = `${API_URL}/api/v1/portfolio/${portfolioId}`;
    const response = await api.get(url);
    const data: any = response.data;
    return (data?.data as Portfolio) ?? (data as Portfolio) ?? null;
  },

  async updatePortfolio(portfolioId: string, payload: Partial<PortfolioPayload>, authToken?: string): Promise<ApiEnvelope<Portfolio>> {
    const url = `${API_URL}/api/v1/portfolio/${portfolioId}`;
    const response = await api.put(url, payload, authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined);
    return response.data as ApiEnvelope<Portfolio>;
  },

  async toggleVisibility(portfolioId: string, authToken?: string): Promise<ApiEnvelope<Portfolio>> {
    const url = `${API_URL}/api/v1/portfolio/${portfolioId}/toggle-visibility`;
    const response = await api.patch(url, undefined, authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined);
    return response.data as ApiEnvelope<Portfolio>;
  },

  async deletePortfolio(portfolioId: string, authToken?: string): Promise<ApiEnvelope<{ id: string }>> {
    const url = `${API_URL}/api/v1/portfolio/${portfolioId}`;
    const response = await api.delete(url, authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined);
    return response.data as ApiEnvelope<{ id: string }>;
  },

  async getPublicByProfessional(professionalType: ProfessionalType, professionalId: string): Promise<Portfolio[]> {
    const url = `${API_URL}/api/v1/portfolio/public/${professionalType}/${professionalId}`;
    const response = await api.get(url);
    const data: any = response.data;
    const portfolios: Portfolio[] =
      (data?.data as Portfolio[] | undefined) ??
      (data?.portfolios as Portfolio[] | undefined) ??
      (Array.isArray(data) ? (data as Portfolio[]) : []);
    return portfolios;
  },

  async getMyPortfolios(): Promise<Portfolio[]> {
    const url = `${API_URL}/api/v1/portfolio/my-portfolios`;
    const response = await api.get(url);
    const data: any = response.data;
    const portfolios: Portfolio[] =
      (data?.data as Portfolio[] | undefined) ??
      (data?.portfolios as Portfolio[] | undefined) ??
      (Array.isArray(data) ? (data as Portfolio[]) : []);
    return portfolios;
  },

  async getPublicAll(filters: PublicPortfolioFilters = {}): Promise<{ items: Portfolio[]; page: number; limit: number; total?: number }> {
    const url = `${API_URL}/api/v1/portfolio/public/all`;
    const response = await api.get(url, { params: filters });
    const data: any = response.data;
    const items: Portfolio[] =
      (data?.data as Portfolio[] | undefined) ??
      (data?.items as Portfolio[] | undefined) ??
      (data?.portfolios as Portfolio[] | undefined) ??
      (Array.isArray(data) ? (data as Portfolio[]) : []);
    const page: number = data?.page ?? filters.page ?? 1;
    const limit: number = data?.limit ?? filters.limit ?? 10;
    const total: number | undefined = data?.total;
    return { items, page, limit, total };
  },
};




