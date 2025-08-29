import axiosInstance from '@/lib/axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com'

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
         // Register a new constructor
       async register(data: ConstructorRegistrationData): Promise<{ message: string; constructor: Constructor }> {
         const response = await axiosInstance.post<{ message: string; constructor: Constructor }>(`${API_BASE_URL}/api/v1/contractors/register`, data)
         return response.data
       },

         // Get all approved contractors
       async getApprovedContractors(): Promise<Constructor[]> {
         const response = await axiosInstance.get<Constructor[]>(`${API_BASE_URL}/api/v1/contractors/approved`)
         return response.data
       },

         // Get contractor by ID
       async getContractorById(id: string): Promise<Constructor> {
         const response = await axiosInstance.get<Constructor>(`${API_BASE_URL}/api/v1/contractors/${id}`)
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
  async updateTechnicianProfile(data: TechnicianProfileData): Promise<{ success: boolean; data: TechnicianData }> {
    const response = await axiosInstance.put<{ success: boolean; data: TechnicianData }>(`${API_BASE_URL}/api/v1/contractors/profile/me`, data)
    return response.data
  },

  // Admin: Get all contractors
  async getAllContractors(): Promise<Constructor[]> {
    const response = await axiosInstance.get<Constructor[]>(`${API_BASE_URL}/api/v1/contractors/admin/all`)
    return response.data
  },

  // Admin: Get pending contractor requests
  async getPendingContractors(): Promise<Constructor[]> {
    const response = await axiosInstance.get<Constructor[]>(`${API_BASE_URL}/api/v1/contractors/admin/pending`)
    return response.data
  },

  // Admin: Update contractor status
  async updateContractorStatus(id: string, status: ConstructorStatusUpdate): Promise<{ message: string; constructor: Constructor }> {
    const response = await axiosInstance.put<{ message: string; constructor: Constructor }>(`${API_BASE_URL}/api/v1/contractors/admin/${id}/status`, status)
    return response.data
  }
}
