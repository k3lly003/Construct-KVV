import { Projects } from "@/types/project";
import axios from "axios";
import dotenv from "dotenv";
import { toast } from "sonner";
dotenv.config();
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const projectService = {
  async getAllProjects(authToken: string): Promise<Projects> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data.data;
    } catch (error) {
      toast.error("Unale to get your credentials, Login first");
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error Response:", error.response.data);
        console.error("API Error Status:", error.response.status);
      }
      throw error;
    }
  },
  async updateMyProject(
    formData: FormData,
    authToken: string
  ): Promise<Projects> {
    try {
      const response = await axios.put(`${API_URL}/api/v1/user/me`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
  async deleteMyProject(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
