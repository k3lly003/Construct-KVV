import { customerRequest } from '@/types/customer-request';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SellerRequestPayload {
  email: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  taxId: string;
}

export const customerRequestService = {
  async requestToBecomeSeller(
    data: SellerRequestPayload,
    authToken: string
  ): Promise<customerRequest> {
    try {
      const response = await axios.post<customerRequest>(
        `${API_URL}/api/v1/seller/request`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating seller request:', error);

      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }

      throw error;
    }
  },
};
