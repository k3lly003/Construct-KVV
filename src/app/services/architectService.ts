import axiosInstance from '@/lib/axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com'

// Architect Registration Data Interface
export interface ArchitectRegistrationData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  businessName: string
  licenseNumber: string
  location: string[]
  yearsExperience: number
  documents: string[]
  specializations: string[]
}

// Architect Profile Update Data Interface
export interface ArchitectProfileData {
  businessName: string
  licenseNumber: string
  location: string[]
  yearsExperience: number
  documents: string[]
  specializations: string[]
  payoutMethod?: {
    type: string
    accountNumber: string
  }
}

// Architect Status Update Interface (Admin)
export interface ArchitectStatusUpdate {
  status: 'APPROVED' | 'REJECTED' | 'PENDING'
}

// Architect Interface
export interface Architect {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  businessName: string
  licenseNumber: string
  location: string[]
  yearsExperience: number
  documents: string[]
  specializations: string[]
  status: string
  payoutMethod?: {
    type: string
    accountNumber: string
  }
  createdAt: string
  updatedAt: string
}

// Architect Service
export const architectService = {
  // Register a new architect
  async register(data: ArchitectRegistrationData): Promise<{ message: string; architect: Architect }> {
    const response = await axiosInstance.post<{ message: string; architect: Architect }>(`${API_BASE_URL}/api/v1/architects/register`, data)
    return response.data
  },

  // Get all approved architects
  async getApprovedArchitects(): Promise<Architect[]> {
    const response = await axiosInstance.get<Architect[]>(`${API_BASE_URL}/api/v1/architects/approved`)
    return response.data
  },

  // Get architect by ID
  async getArchitectById(id: string): Promise<Architect> {
    const response = await axiosInstance.get<Architect>(`${API_BASE_URL}/api/v1/architects/${id}`)
    return response.data
  },

  // Get current architect profile
  async getCurrentProfile(): Promise<Architect> {
    const response = await axiosInstance.get<Architect>(`${API_BASE_URL}/api/v1/architects/profile/me`)
    return response.data
  },

  // Update current architect profile
  async updateProfile(data: ArchitectProfileData): Promise<{ message: string; architect: Architect }> {
    const response = await axiosInstance.put<{ message: string; architect: Architect }>(`${API_BASE_URL}/api/v1/architects/profile/me`, data)
    return response.data
  },

  // Admin: Get all architects
  async getAllArchitects(): Promise<Architect[]> {
    const response = await axiosInstance.get<Architect[]>(`${API_BASE_URL}/api/v1/architects/admin/all`)
    return response.data
  },

  // Admin: Get pending architect requests
  async getPendingArchitects(): Promise<Architect[]> {
    const response = await axiosInstance.get<Architect[]>(`${API_BASE_URL}/api/v1/architects/admin/pending`)
    return response.data
  },

  // Admin: Update architect status
  async updateArchitectStatus(id: string, status: ArchitectStatusUpdate): Promise<{ message: string; architect: Architect }> {
    const response = await axiosInstance.put<{ message: string; architect: Architect }>(`${API_BASE_URL}/api/v1/architects/admin/${id}/status`, status)
    return response.data
  }
}
