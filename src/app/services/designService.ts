import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Design {
  id: string;
  title: string;
  description: string;
  buildingDescription: string;
  price: number;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LANDSCAPE' | 'INTERIOR' | 'URBAN_PLANNING' | 'RENOVATION' | 'SUSTAINABLE' | 'LUXURY' | 'AFFORDABLE';
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  images: string[];
  documents: string[];
  tags: string[];
  isActive: boolean;
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  architectId: string;
  architect: {
    id: string;
    businessName: string;
    user: {
      firstName: string;
      lastName: string;
      profilePic?: string;
    };
  };
}

export interface DesignSearchParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  tags?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DesignSearchResponse {
  success: boolean;
  data: Design[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const designService = {
  /**
   * Search designs with server-side filtering
   * @param params - Search parameters
   * @param authToken - Optional authentication token
   * @returns Design search response with pagination
   */
  async searchDesigns(
    params: DesignSearchParams,
    authToken?: string
  ): Promise<DesignSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 20).toString(),
      });

      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.minSquareFootage) queryParams.append('minSquareFootage', params.minSquareFootage.toString());
      if (params.maxSquareFootage) queryParams.append('maxSquareFootage', params.maxSquareFootage.toString());
      if (params.bedrooms) queryParams.append('bedrooms', params.bedrooms.toString());
      if (params.bathrooms) queryParams.append('bathrooms', params.bathrooms.toString());
      if (params.floors) queryParams.append('floors', params.floors.toString());
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await axios.get<DesignSearchResponse>(
        `${API_URL}/api/v1/design?${queryParams.toString()}`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Design search error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search designs');
    }
  },
};

