import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface GlobalSearchParams {
  query: string;
  types?: string; // Comma-separated: 'products', 'services', 'designs', 'portfolios'
  page?: number;
  limit?: number;
}

export interface GlobalSearchResponse {
  success: boolean;
  data: {
    products: { data: any[]; total: number };
    services: { data: any[]; total: number };
    designs: { data: any[]; total: number };
    portfolios: { data: any[]; total: number };
    summary: { totalResults: number; query: string };
  };
}

export const searchService = {
  /**
   * Perform global search across all entity types
   * @param params - Search parameters
   * @param authToken - Optional authentication token
   * @returns Global search response with results from all entity types
   */
  async globalSearch(
    params: GlobalSearchParams,
    authToken?: string
  ): Promise<GlobalSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        q: params.query,
      });

      if (params.types) queryParams.append('types', params.types);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await axios.get<GlobalSearchResponse>(
        `${API_URL}/api/v1/search?${queryParams.toString()}`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Global search error:', error);
      throw new Error(error.response?.data?.message || 'Failed to perform global search');
    }
  },
};

