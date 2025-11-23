import axios from "axios";
import { getApiUrl, RENDER_API_URL, RAILWAY_API_URL } from '@/lib/apiConfig';

const API_URL = RENDER_API_URL;

export interface SellerRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessName: string;
  ownerName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  deliveryRadius: number;
  location: string;
  shopImage: File | string;
  shopDescription: string;
  documents: File[];
  taxId: string;
}

export interface SellerProfile {
  _id: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  taxId: string;
  status: string;
  commissionRate?: number;
  payoutMethod?: string | null;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    // Add more fields as needed
  };
  // Add more fields as needed
}

export const registerSeller = async (data: SellerRegistrationData) => {
  console.log("API_URL:", API_URL);
  console.log("Making API call to:", `${API_URL}/api/v1/sellers/register`);
  console.log("With data:", data);
  
  // Validate required fields
  if (!data.email || !data.password || !data.firstName || !data.lastName) {
    throw new Error("Missing required fields");
  }
  
  if (!data.documents || data.documents.length === 0) {
    throw new Error("At least one document is required");
  }
  
  // Test mode - try with minimal data first
  const TEST_MODE = false; // Set to true to test with minimal data
  
  try {
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all text fields - using exact field names from API
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('phone', data.phone);
    formData.append('businessName', data.businessName);
    formData.append('ownerName', data.ownerName);
    formData.append('businessAddress', data.businessAddress);
    formData.append('businessPhone', data.businessPhone);
    formData.append('businessEmail', data.businessEmail);
    formData.append('deliveryRadius', data.deliveryRadius.toString());
    formData.append('location', data.location);
    formData.append('shopDescription', data.shopDescription);
    formData.append('taxId', data.taxId);
    
    console.log("Data validation:");
    console.log("- Email:", data.email);
    console.log("- Password length:", data.password?.length);
    console.log("- Documents count:", data.documents?.length);
    console.log("- Shop image type:", typeof data.shopImage);
    console.log("- Delivery radius:", data.deliveryRadius);
    
    // Handle shop image (could be File or string URL)
    if (data.shopImage instanceof File) {
      formData.append('shopImage', data.shopImage);
    } else {
      formData.append('shopImage', data.shopImage);
    }
    
    // Handle documents (array of Files) - try multiple approaches
    data.documents.forEach((file, index) => {
      // Try both formats that different servers might expect
      formData.append('documents', file);
      formData.append('documents[]', file);
    });
    
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    // Use Railway for registration (email-sending endpoint)
    const registerUrl = `${RAILWAY_API_URL}/api/v1/sellers/register`;
    console.log("Using Railway for registration:", registerUrl);
    
    // Try the plural endpoint first
    let response;
    try {
      response = await axios.post(registerUrl, formData, {
        headers: {
          // Let axios set the Content-Type automatically for FormData
          // 'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      // If 404, try the singular endpoint
      if (error.response?.status === 404) {
        console.log("Trying singular endpoint: /api/v1/seller/register");
        response = await axios.post(`${RAILWAY_API_URL}/api/v1/seller/register`, formData, {
          headers: {
            // Let axios set the Content-Type automatically for FormData
            // 'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        throw error;
      }
    }
    
    console.log("API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("API error details:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Request URL:", error.config?.url);
    console.error("Request Headers:", error.config?.headers);
    console.error("Full Error:", error);
    throw error;
  }
};

export const getSellerProfile = async (sellerId: string, token: string) => {
  const response = await axios.get(`${API_URL}/api/v1/seller/profile/${sellerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ============ New seller-facing endpoints ============

// Helper to unwrap common envelope shapes
function unwrap<T>(payload: any): T {
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload)) return payload as T;
    if ('data' in payload) return (payload as any).data as T;
  }
  return payload as T;
}

export type SellerOrder = { _id: string; status: string; [key: string]: any };
export type SellerDashboard = { [key: string]: any };

// GET /api/v1/seller/profile → current seller profile
export const getMySellerProfile = async (token: string): Promise<SellerProfile> => {
  const response = await axios.get(`${API_URL}/api/v1/seller/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return unwrap<SellerProfile>(response.data);
};

// GET /api/v1/seller/orders
export const getSellerOrders = async (token: string): Promise<SellerOrder[]> => {
  const response = await axios.get(`${API_URL}/api/v1/seller/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return unwrap<SellerOrder[]>(response.data);
};

// PUT /api/v1/seller/orders/{orderId}/status
export const updateSellerOrderStatus = async (
  orderId: string,
  status: string,
  token: string
): Promise<SellerOrder> => {
  const response = await axios.put(
    `${API_URL}/api/v1/seller/orders/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return unwrap<SellerOrder>(response.data);
};

// GET /api/v1/seller/dashboard
export const getSellerDashboard = async (token: string): Promise<SellerDashboard> => {
  const response = await axios.get(`${API_URL}/api/v1/seller/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return unwrap<SellerDashboard>(response.data);
};

// GET /api/v1/seller → all sellers (public/admin depending on backend rules)
export const listSellers = async (token?: string): Promise<SellerProfile[]> => {
  const response = await axios.get(`${API_URL}/api/v1/seller`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return unwrap<SellerProfile[]>(response.data);
};

// GET /api/v1/seller/requests → pending registrations
export const getSellerRequests = async (token: string): Promise<SellerProfile[]> => {
  const response = await axios.get(`${API_URL}/api/v1/seller/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return unwrap<SellerProfile[]>(response.data);
};

// Admin methods for seller management
export const getAllSellers = async (token: string): Promise<SellerProfile[]> => {
  const response = await axios.get(`${API_URL}/api/v1/sellers/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('getAllSellers response:', response.data);
  // Handle different response formats
  if (response.data && (response.data as any).data && Array.isArray((response.data as any).data)) {
    return (response.data as any).data as SellerProfile[];
  } else if (Array.isArray(response.data)) {
    return response.data as SellerProfile[];
  }
  return [];
};

export const getApprovedSellers = async (token: string): Promise<SellerProfile[]> => {
  const response = await axios.get(`${API_URL}/api/v1/sellers/approved`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('getApprovedSellers response:', response.data);
  // Handle different response formats
  if (response.data && (response.data as any).data && Array.isArray((response.data as any).data)) {
    return (response.data as any).data as SellerProfile[];
  } else if (Array.isArray(response.data)) {
    return response.data as SellerProfile[];
  }
  return [];
};

export const getPendingSellers = async (token: string): Promise<SellerProfile[]> => {
  const response = await axios.get(`${API_URL}/api/v1/sellers/admin/pending`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('getPendingSellers response:', response.data);
  // Handle different response formats
  if (response.data && (response.data as any).data && Array.isArray((response.data as any).data)) {
    return (response.data as any).data as SellerProfile[];
  } else if (Array.isArray(response.data)) {
    return response.data as SellerProfile[];
  }
  return [];
};

// Seller Status Update Interface
export interface SellerStatusUpdate {
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
}

// Update seller status (Admin only)
export const updateSellerStatus = async (id: string, status: SellerStatusUpdate, token: string): Promise<{ message: string; seller: SellerProfile }> => {
  const response = await axios.put(`${API_URL}/api/v1/seller/${id}/status`, status, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as { message: string; seller: SellerProfile };
};

