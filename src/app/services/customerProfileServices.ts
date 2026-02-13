import { Customer } from "@/types/customer";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type GetProfileResponse = { data: Customer };

export const customerProfileService = {
  async getMyProfile(authToken: string): Promise<Customer> {
    try {
      console.log(
        "🔍 Making profile API call with token:",
        authToken.substring(0, 20) + "..."
      );

      const response = await axios.get<GetProfileResponse>(
        `${API_URL}/api/v1/user/me`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("✅ Profile API success:", response.data);
      return response.data.data;
    } catch (error: unknown) {
      console.error("❌ Profile API error:", error);

      // Check if it's an axios error with response
      if ((axios as any).isAxiosError && (axios as any).isAxiosError(error)) {
        const err = error as any; // Explicit casting to 'any' due to unknown type issues
        const status = err.response?.status;
        const message = err.response?.data?.message || err.message;

        if (status === 401) {
          // Token is invalid or expired
          toast.error("Your session has expired. Please login again.");
        } else if (status === 404) {
          // User profile not found - might be a new Google user
          toast.error("Profile not found. Please complete your profile setup.");
        } else if (status >= 500) {
          // Server error
          toast.error("Server error. Please try again later.");
        } else {
          // Other client errors
          toast.error("Unable to load your profile. Please try again.");
        }

        throw new Error(`API Error (${status}): ${message}`);
      } else {
        // Network or other errors
        toast.error(
          "Network error. Please check your connection and try again."
        );
        throw error instanceof Error ? error : new Error(String(error));
      }
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
