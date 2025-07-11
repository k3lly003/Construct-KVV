import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SellerRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
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
  const response = await axios.post(`${API_URL}/api/v1/seller/register`, data);
  return response.data;
};

export const getSellerProfile = async (sellerId: string, token: string) => {
  const response = await axios.get(`${API_URL}/api/v1/seller/profile/${sellerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
