import axiosInstance from '@/lib/axios'

import { RENDER_API_URL, RAILWAY_API_URL } from '@/lib/apiConfig';

const API_BASE_URL = RENDER_API_URL;
const RAILWAY_BASE_URL = RAILWAY_API_URL;

// Types for constructor data
export interface ConstructorRegistrationData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  businessName: string
  businessAddress: string
  businessPhone: string
  taxId: string
  location: string[]
  yearsExperience: number
  licenseNumber: string
  insuranceInfo: {
    provider: string
    policyNumber: string
  }
  documents: string[]
}

export interface ConstructorProfileData {
  businessName: string
  businessAddress: string
  businessPhone: string
  taxId: string
  location: string[]
  yearsExperience: number
  licenseNumber: string
  insuranceInfo: {
    provider: string
    policyNumber: string
  }
  documents: string[]
  payoutMethod?: {
    type: string
    accountNumber: string
  }
}

// New interface for technician data structure
export interface TechnicianData {
  businessAddress: string
  businessPhone: string
  taxId: string
  licenseNumber: string
  insuranceInfo: any
  businessName: string
  yearsExperience: any
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  commissionRate: number;
  payoutMethod: any;
  documents: string[];
  experience: number;
  createdAt: string;
  updatedAt: string;
  categories: string[];
  location: string[];
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePic: string | null;
    phone: string;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
  };
}

export interface TechnicianProfileData {
  experience: number;
  categories: string[];
  location: string[];
}

export interface ConstructorStatusUpdate {
  status: 'APPROVED' | 'REJECTED' | 'PENDING'
}

export interface Constructor {
  payoutMethod: any
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  businessName: string
  businessAddress: string
  businessPhone: string
  taxId: string
  location: string[]
  yearsExperience: number
  licenseNumber: string
  insuranceInfo: {
    provider: string
    policyNumber: string
  }
  documents: string[]
  status: 'APPROVED' | 'REJECTED' | 'PENDING'
  createdAt: string
  updatedAt: string
}

// Constructor Service
export const constructorService = {
         // Register a new constructor (uses Railway for email)
       async register(data: ConstructorRegistrationData): Promise<{ message: string; constructor: Constructor }> {
         const response = await axiosInstance.post<{ message: string; constructor: Constructor }>(`${RAILWAY_BASE_URL}/api/v1/contractors/register`, data)
         return response.data
       },

       // Get all contractors
       async getAllContractors(): Promise<Constructor[]> {
         const response = await axiosInstance.get<any>(`${API_BASE_URL}/api/v1/contractors/admin/all`);
         console.log('getAllContractors response:', response.data);
         // Handle different response formats
         if (response.data && response.data.data && Array.isArray(response.data.data)) {
           return response.data.data;
         } else if (Array.isArray(response.data)) {
           return response.data;
         }
         return [];
       },

         // Get all approved contractors
       async getApprovedContractors(): Promise<Constructor[]> {
         const response = await axiosInstance.get<any>(`${API_BASE_URL}/api/v1/contractors/approved`);
         console.log('getApprovedContractors response:', response.data);
         // Handle different response formats
         if (response.data && response.data.data && Array.isArray(response.data.data)) {
           return response.data.data;
         } else if (Array.isArray(response.data)) {
           return response.data;
         }
         return [];
       },

         // Get contractor by ID
       async getContractorById(id: string): Promise<Constructor> {
         const response = await axiosInstance.get<Constructor>(`${API_BASE_URL}/api/v1/contractors/${id}`);
         return response.data
       },

  // Get current contractor profile
  async getCurrentProfile(): Promise<{ success: boolean; data: TechnicianData }> {
    const response = await axiosInstance.get<{ success: boolean; data: TechnicianData }>(`${API_BASE_URL}/api/v1/contractors/profile/me`)
    return response.data
  },

  // Update current contractor profile
  async updateProfile(data: ConstructorProfileData): Promise<{ message: string; constructor: Constructor }> {
    const response = await axiosInstance.put<{ message: string; constructor: Constructor }>(`${API_BASE_URL}/api/v1/contractors/profile/me`, data)
    return response.data
  },

  // Update current technician profile
  async updateConstructorProfile(data: ConstructorProfileData): Promise<{ success: boolean; data: Constructor }> {
    const response = await axiosInstance.put<{ success: boolean; data: Constructor }>(`${API_BASE_URL}/api/v1/contractors/profile/me`, data)
    return response.data
  },

  // Admin: Get pending contractor requests
  async getPendingContractors(): Promise<Constructor[]> {
    const response = await axiosInstance.get<any>(`${API_BASE_URL}/api/v1/contractors/admin/pending`)
    console.log('getPendingContractors response:', response.data);
    // Handle different response formats
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Admin: Update contractor status
  async updateContractorStatus(id: string, status: ConstructorStatusUpdate): Promise<{ message: string; constructor: Constructor }> {
    const response = await axiosInstance.put<{ message: string; constructor: Constructor }>(`${API_BASE_URL}/api/v1/contractors/admin/${id}/status`, status)
    return response.data
  }
}
