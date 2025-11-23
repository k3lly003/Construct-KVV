import axiosInstance from '@/lib/axios'

import { RENDER_API_URL, RAILWAY_API_URL } from '@/lib/apiConfig';

const API_BASE_URL = RENDER_API_URL;
const RAILWAY_BASE_URL = RAILWAY_API_URL;

// Technician Registration Data Interface
export interface TechnicianRegistrationData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  categories: string[]
  location: string[]
  documents: string[]
  experience: number
  specializations: string[]
}

// Technician Profile Update Data Interface
export interface TechnicianProfileData {
  categories: string[]
  location: string[]
  documents: string[]
  experience: number
  specializations?: string[]
  payoutMethod?: {
    type: string
    accountNumber: string
  }
}

// Technician Status Update Interface (Admin)
export interface TechnicianStatusUpdate {
  status: 'APPROVED' | 'REJECTED' | 'PENDING'
}

// Technician Interface
export interface Technician {
  id: string
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  commissionRate: number
  payoutMethod: any
  documents: string[]
  experience: number
  createdAt: string
  updatedAt: string
  categories: string[]
  location: string[]
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    profilePic: string | null
    phone: string
    role: string
    isActive: boolean
    emailVerified: boolean
    createdAt: string
  }
}

// Technician Service
export const technicianService = {
  // Register a new technician (uses Railway for email)
  async register(data: TechnicianRegistrationData): Promise<{ message: string; technician: Technician }> {
    const response = await axiosInstance.post<{ message: string; technician: Technician }>(`${RAILWAY_BASE_URL}/api/v1/technicians/register`, data)
    return response.data
  },

  // Admin: Get all technicians
  async getAllTechnicians(): Promise<Technician[]> {
    const response = await axiosInstance.get<any>(`${API_BASE_URL}/api/v1/technicians/admin/all`)
    console.log('getAllTechnicians response:', response.data);
    // Handle different response formats
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },
  // Get all approved technicians
  async getApprovedTechnicians(): Promise<Technician[]> {
    const response = await axiosInstance.get<any>(`${API_BASE_URL}/api/v1/technicians/approved`)
    console.log('getApprovedTechnicians response:', response.data);
    // Handle different response formats
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Admin: Get pending technician requests
  async getPendingTechnicians(): Promise<Technician[]> {
    const response = await axiosInstance.get<any>(`${API_BASE_URL}/api/v1/technicians/admin/pending`)
    console.log('getPendingTechnicians response:', response.data);
    // Handle different response formats
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Get current technician profile
  async getCurrentProfile(): Promise<{ success: boolean; data: Technician }> {
    const response = await axiosInstance.get<{ success: boolean; data: Technician }>(`${API_BASE_URL}/api/v1/technicians/profile/me`)
    return response.data
  },

  // Update current technician profile
  async updateProfile(data: TechnicianProfileData): Promise<{ message: string; technician: Technician }> {
    const response = await axiosInstance.put<{ message: string; technician: Technician }>(`${API_BASE_URL}/api/v1/technicians/profile/me`, data)
    return response.data
  },

  // Admin: Update technician status
  async updateTechnicianStatus(id: string, status: TechnicianStatusUpdate): Promise<{ message: string; technician: Technician }> {
    const response = await axiosInstance.put<{ message: string; technician: Technician }>(`${API_BASE_URL}/api/v1/technicians/admin/${id}/status`, status)
    return response.data
  },

  // Get technician by ID
  async getTechnicianById(id: string): Promise<Technician> {
    const response = await axiosInstance.get<{ success: boolean; data: Technician }>(`${API_BASE_URL}/api/v1/technicians/${id}`)
    return response.data.data
  }
}



