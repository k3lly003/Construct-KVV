import { customerRequest } from '@/types/customer-request';
import axios, { isAxiosError } from 'axios';

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
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as any).isAxiosError &&
        "response" in error &&
        (error as any).response
      ) {
        const errResponse = (error as any).response;
        console.error("API Error Response:", errResponse.data);
        console.error("API Error Status:", errResponse.status);
      }
      throw error instanceof Error ? error : new Error(String(error));
    }
  },
};
