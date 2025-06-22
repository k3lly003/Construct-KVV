import { Project, ProjectsResponse } from "@/types/project";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3000";

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      console.log("🚀 Fetching all projects...");
      console.log("🔗 API URL:", `${API_BASE_URL}/api/v1/final-project`);
      console.log("🔑 Auth Token:", authToken.substring(0, 20) + "...");

      const response = await axios.get(`${API_BASE_URL}/api/v1/final-project`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Projects API Response Status:", response.status);
      console.log("✅ Projects API Response Data:", response.data);

      // Handle different response structures
      const responseData = response.data as any;
      if (Array.isArray(responseData)) {
        return responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } else {
        console.warn("⚠️ Unexpected response structure:", responseData);
        return [];
      }
    } catch (error: any) {
      console.error("❌ Error fetching projects:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Unable to fetch projects. Please try again.");
      }
      throw error;
    }
  },

  async getProjectById(id: string): Promise<Project> {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      console.log("🚀 Fetching project by ID:", id);
      console.log("🔗 API URL:", `${API_BASE_URL}/api/v1/final-project/${id}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/final-project/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Project API Response Status:", response.status);
      console.log("✅ Project API Response Data:", response.data);

      return response.data as Project;
    } catch (error: any) {
      console.error("❌ Error fetching project:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 404) {
        toast.error("Project not found.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Unable to fetch project details. Please try again.");
      }
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      console.log("🚀 Deleting project:", id);

      await axios.delete(`${API_BASE_URL}/api/v1/final-project/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Project deleted successfully");
      toast.success("Project deleted successfully");
    } catch (error: any) {
      console.error("❌ Error deleting project:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Unable to delete project. Please try again.");
      }
      throw error;
    }
  },
};
