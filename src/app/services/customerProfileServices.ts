
import { Customer } from "@/types/customer";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type GetProfileResponse = { data: Customer };

export const customerProfileService = {
  async getMyProfile(authToken: string): Promise<Customer> {
    try {
      const response = await axios.get<GetProfileResponse>(
        `${API_URL}/api/v1/user/me`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      toast.error("Unable to get your credentials, Login first");
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async updateMyProfile(
    formData: FormData,
    authToken: string
  ): Promise<Customer> {
    try {
      const response = await axios.put<Customer>(
        `${API_URL}/api/v1/user/me`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async deleteMyProfile(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error: unknown) {
      console.error("Error deleting profile:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },
};
