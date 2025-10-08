import axiosInstance from "@/lib/axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://construct-kvv-bn-fork.onrender.com";

// Architect Registration Data Interface
export interface ArchitectRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessName: string;
  licenseNumber: string;
  location: string[];
  yearsExperience: number;
  documents: string[];
  specializations: string[];
}

// Architect Profile Update Data Interface
export interface ArchitectProfileData {
  businessName: string;
  licenseNumber: string;
  location: string[];
  yearsExperience: number;
  documents: string[];
  specializations?: string[];
  payoutMethod?: {
    type: string;
    accountNumber: string;
  };
}

// Architect Status Update Interface (Admin)
export interface ArchitectStatusUpdate {
  status: "APPROVED" | "REJECTED" | "PENDING";
}

// Architect Interface
export interface Architect {
  id: string;
  businessName: string;
  licenseNumber: string;
  location: string[];
  yearsExperience: number;
  documents: string[];
  specializations: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  commissionRate: number;
  payoutMethod?: {
    type: string;
    accountNumber: string;
  };
  createdAt: string;
  updatedAt: string;
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

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  workDate: string;
  images: string[];
  category: string;
  location?: string;
  budget?: string;
  duration?: string;
  skills: string[];
  clientFeedback?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  architectId?: string;
  contractorId?: string;
  technicianId?: string;
  sellerId?: string;
}

export interface CreateDesignRequestDTO {
  portfolioId?: string;
}

export interface DesignRequest {
  id: string;
  portfolioId: string | null;
  customerId: string;
  architectId: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  architect: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  portfolio?: {
    id: string;
    title: string;
    description: string;
  };
}

// Architect Service
export const architectService = {
  // Register a new architect
  async register(
    data: ArchitectRegistrationData
  ): Promise<{ message: string; architect: Architect }> {
    const response = await axiosInstance.post<{
      message: string;
      architect: Architect;
    }>(`${API_BASE_URL}/api/v1/architects/register`, data);
    return response.data;
  },

  // Get all approved architects
  async getApprovedArchitects(): Promise<Architect[]> {
    const response = await axiosInstance.get<any>(
      `${API_BASE_URL}/api/v1/architects/approved`
    );
    console.log("getApprovedArchitects response:", response.data);
    // Handle different response formats
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Get architect by ID
  async getArchitectById(id: string): Promise<Architect> {
    const response = await axiosInstance.get<Architect>(
      `${API_BASE_URL}/api/v1/architects/${id}`
    );
    return response.data;
  },

  // Get current architect profile
  async getCurrentProfile(): Promise<{ success: boolean; data: Architect }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: Architect;
    }>(`${API_BASE_URL}/api/v1/architects/profile/me`);
    return response.data;
  },

  // Update current architect profile
  async updateProfile(
    data: ArchitectProfileData
  ): Promise<{ message: string; architect: Architect }> {
    const response = await axiosInstance.put<{
      message: string;
      architect: Architect;
    }>(`${API_BASE_URL}/api/v1/architects/profile/me`, data);
    return response.data;
  },

  // Admin: Get all architects
  async getAllArchitects(): Promise<Architect[]> {
    const response = await axiosInstance.get<any>(
      `${API_BASE_URL}/api/v1/architects/admin/all`
    );
    console.log("getAllArchitects response:", response.data);
    // Handle different response formats
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Admin: Get pending architect requests
  async getPendingArchitects(): Promise<Architect[]> {
    const response = await axiosInstance.get<any>(
      `${API_BASE_URL}/api/v1/architects/admin/pending`
    );
    console.log("getPendingArchitects response:", response.data);
    // Handle different response formats
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  // Admin: Update architect status
  async updateArchitectStatus(
    id: string,
    status: ArchitectStatusUpdate
  ): Promise<{ message: string; architect: Architect }> {
    const response = await axiosInstance.put<{
      message: string;
      architect: Architect;
    }>(`${API_BASE_URL}/api/v1/architects/admin/${id}/status`, status);
    return response.data;
  },

  // Get architect portfolios
  async getArchitectPortfolios(architectId: string): Promise<Portfolio[]> {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        data: Portfolio[];
        count: number;
      }>(`${API_BASE_URL}/api/v1/portfolio/public/architect/${architectId}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      return [];
    }
  },

  // Get professional portfolios (generic method for all professional types)
  async getProfessionalPortfolios(
    professionalType: "architect" | "contractor" | "technician" | "seller",
    professionalId: string
  ): Promise<Portfolio[]> {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        data: Portfolio[];
        count: number;
      }>(
        `${API_BASE_URL}/api/v1/portfolio/public/${professionalType}/${professionalId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching professional portfolios:", error);
      return [];
    }
  },

  // Create design request
  async createDesignRequest(
    data: CreateDesignRequestDTO
  ): Promise<DesignRequest> {
    const response = await axiosInstance.post<DesignRequest>(
      `${API_BASE_URL}/api/v1/design-requests`,
      {
        portfolioId: data.portfolioId,
      }
    );
    return response.data;
  },

  // Get design requests for architect
  async getDesignRequests(): Promise<DesignRequest[]> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: DesignRequest[];
    }>(`${API_BASE_URL}/api/v1/architects/me/design-requests`);
    return response.data.data || [];
  },

  // Get architect's designs
  async getMyDesigns(
    includeInactive: boolean = false
  ): Promise<{ success: boolean; data: any[]; count: number }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: any[];
      count: number;
    }>(
      `${API_BASE_URL}/api/v1/design/my-designs?includeInactive=${includeInactive}`
    );
    return response.data;
  },
};
