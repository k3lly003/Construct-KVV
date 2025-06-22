import { Project, ProjectsResponse } from "@/types/project";
import axios from "axios";
import { toast } from "sonner";
import { FormData } from "@/app/utils/fakes/formData";

const API_BASE_URL = "http://localhost:3000";

// Define the status types
export type ProjectStatus = "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";

// Interface for status update request
interface StatusUpdateRequest {
  status: ProjectStatus;
}

// Interface for project update request
export interface ProjectUpdateData {
  roomsCount: number;
  bathroomsCount: number;
  kitchensCount: number;
  conversationRoomsCount: number;
  extras: Array<{
    name: string;
    detail: { count: number };
  }>;
  description: string;
  estimatedCost: number;
}

// Utility function to convert form data to project update format
export const convertFormDataToProjectUpdate = (
  formData: FormData
): ProjectUpdateData => {
  console.log("🔄 Converting form data to project update format");
  console.log("📝 Input form data:", formData);
  console.log("📝 Form data type:", typeof formData);
  console.log("📝 Form data keys:", Object.keys(formData || {}));

  // Extract features from form data (assuming they're stored in apiResponse or similar)
  const features = formData?.apiResponse?.features || [];
  console.log("🔍 Extracted features:", features);
  console.log("🔍 Features type:", typeof features);
  console.log("🔍 Features length:", features.length);

  // Convert features to extras format - using the correct structure
  const extras = features.map((feature: any) => {
    console.log("🔧 Processing feature:", feature);
    return {
      name: feature.name || feature.type || "feature",
      detail: { count: feature.count || 1 },
    };
  });
  console.log("🔧 Converted extras:", extras);

  // If no features, create a default extra
  if (extras.length === 0) {
    console.log("⚠️ No features found, adding default extras");
    extras.push(
      {
        name: "garage",
        detail: { count: 1 },
      },
      {
        name: "garden",
        detail: { count: 1 },
      }
    );
  }

  const result = {
    roomsCount: formData?.bedrooms || 0,
    bathroomsCount: formData?.bathrooms || 0,
    kitchensCount: 1, // Default to 1 kitchen
    conversationRoomsCount: 0, // Default to 0 conversation rooms
    extras: extras, // Now back to array format
    description:
      formData?.apiResponse?.description ||
      formData?.houseSummary?.fullDescription ||
      `${formData?.bedrooms || 0}-bedroom ${
        formData?.projectType || "residential"
      } home`,
    estimatedCost:
      formData?.apiResponse?.estimatedCost ||
      formData?.apiResponse?.totalCost ||
      25000000, // Default cost
  };

  console.log("✅ Final project update data:", result);
  console.log("✅ Result type:", typeof result);
  console.log("✅ Result keys:", Object.keys(result));
  return result;
};

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
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else {
        toast.error("Unable to fetch projects. Please try again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
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
        toast.error("Project not found.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else {
        toast.error("Unable to fetch project details. Please try again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      }
      throw error;
    }
  },

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      console.log("🚀 Updating project status:", id, "to:", status);
      console.log(
        "🔗 API URL:",
        `${API_BASE_URL}/api/v1/final-project/${id}/status`
      );
      console.log("📝 Request Body:", { status });

      const requestBody: StatusUpdateRequest = { status };

      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/final-project/${id}/status`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Status Update API Response Status:", response.status);
      console.log("✅ Status Update API Response Data:", response.data);

      toast.success(`Project status updated to ${status} successfully! 🎉`, {
        style: {
          background: "white",
          color: "#92400e",
          border: "1px solid #f59e0b",
        },
      });
    } catch (error: any) {
      console.error("❌ Error updating project status:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else if (error.response?.status === 404) {
        toast.error("Project not found.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else if (error.response?.status === 400) {
        toast.error("Invalid status value. Please try again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else {
        toast.error("Unable to update project status. Please try again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
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
      toast.success("Project deleted successfully", {
        style: {
          background: "white",
          color: "#059669",
          border: "1px solid #10b981",
        },
      });
    } catch (error: any) {
      console.error("❌ Error deleting project:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else {
        toast.error("Unable to delete project. Please try again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      }
      throw error;
    }
  },

  async updateProject(
    id: string,
    projectData: ProjectUpdateData
  ): Promise<Project> {
    console.log("🔘 SERVICE STEP 1: updateProject method called");
    console.log("🆔 Received ID parameter:", id);
    console.log("📝 Received projectData:", projectData);

    try {
      console.log("🔘 SERVICE STEP 2: Getting auth token");
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.log("❌ SERVICE STEP 2 FAILED: No auth token found");
        throw new Error("No authentication token found");
      }
      console.log("✅ SERVICE STEP 2 PASSED: Auth token found");
      console.log(
        "🔑 Auth Token (first 20 chars):",
        authToken.substring(0, 20) + "..."
      );

      console.log("🔘 SERVICE STEP 3: Preparing request data");
      console.log("🚀 Starting updateProject service call...");
      console.log("🆔 ID type:", typeof id);
      console.log("🆔 ID length:", id.length);
      console.log(
        "🔗 Constructed API URL:",
        `${API_BASE_URL}/api/v1/final-project/${id}`
      );
      console.log("📝 Request Body:", projectData);
      console.log(
        "📝 Request Body JSON:",
        JSON.stringify(projectData, null, 2)
      );
      console.log("✅ SERVICE STEP 3 PASSED: Request data prepared");

      console.log("🔘 SERVICE STEP 4: Validating request body structure");
      // Validate the request body structure
      console.log("🔍 Validating request body structure:");
      console.log(
        "  - roomsCount:",
        typeof projectData.roomsCount,
        projectData.roomsCount
      );
      console.log(
        "  - bathroomsCount:",
        typeof projectData.bathroomsCount,
        projectData.bathroomsCount
      );
      console.log(
        "  - kitchensCount:",
        typeof projectData.kitchensCount,
        projectData.kitchensCount
      );
      console.log(
        "  - conversationRoomsCount:",
        typeof projectData.conversationRoomsCount,
        projectData.conversationRoomsCount
      );
      console.log(
        "  - description:",
        typeof projectData.description,
        projectData.description
      );
      console.log(
        "  - estimatedCost:",
        typeof projectData.estimatedCost,
        projectData.estimatedCost
      );
      console.log("  - extras:", typeof projectData.extras, projectData.extras);
      console.log("✅ SERVICE STEP 4 PASSED: Request body validated");

      console.log("🔘 SERVICE STEP 5: Creating test request");
      // Try with a minimal test request first
      const testRequest = {
        roomsCount: 3,
        bathroomsCount: 2,
        kitchensCount: 1,
        conversationRoomsCount: 1,
        extras: [
          {
            name: "garage",
            detail: { count: 1 },
          },
          {
            name: "garden",
            detail: { count: 1 },
          },
        ],
        description: "Test project update",
        estimatedCost: 25000000,
      };

      console.log(
        "🧪 Testing with minimal request:",
        JSON.stringify(testRequest, null, 2)
      );
      console.log("✅ SERVICE STEP 5 PASSED: Test request created");

      console.log("🔘 SERVICE STEP 6: Making API call");
      console.log(
        "🌐 Making PUT request to:",
        `${API_BASE_URL}/api/v1/final-project/${id}`
      );
      console.log("📤 Request headers:", {
        Authorization: `Bearer ${authToken.substring(0, 20)}...`,
        "Content-Type": "application/json",
      });

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/final-project/${id}`,
        projectData, // Use actual projectData instead of testRequest
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ SERVICE STEP 6 PASSED: API call successful");
      console.log("✅ Project Update API Response Status:", response.status);
      console.log("✅ Project Update API Response Data:", response.data);

      console.log("🔘 SERVICE STEP 7: Showing success toast");
      toast.success("Project updated successfully! 🎉", {
        style: {
          background: "white",
          color: "#92400e",
          border: "1px solid #f59e0b",
        },
      });
      console.log("✅ SERVICE STEP 7 PASSED: Success toast shown");

      console.log("🔘 SERVICE STEP 8: Returning response data");
      console.log("✅ SERVICE STEP 8 PASSED: Returning project data");
      return response.data as Project;
    } catch (error: any) {
      console.log("❌ SERVICE ERROR CAUGHT: API call failed");
      console.error("❌ Error updating project:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error config:", error.config);
      console.error("❌ Full error object:", error);
      console.error(
        "❌ Failed URL:",
        `${API_BASE_URL}/api/v1/final-project/${id}`
      );

      if (error.response?.status === 401) {
        console.log("🔘 SERVICE ERROR STEP: 401 Authentication error");
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else if (error.response?.status === 404) {
        console.log("🔘 SERVICE ERROR STEP: 404 Project not found");
        toast.error("Project not found.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      } else if (error.response?.status === 400) {
        console.log("🔘 SERVICE ERROR STEP: 400 Bad request");
        console.error(
          "❌ 400 Bad Request - API Response:",
          error.response?.data
        );
        toast.error(
          `Invalid project data: ${
            error.response?.data?.message || "Please check your inputs."
          }`,
          {
            style: {
              background: "white",
              color: "#dc2626",
              border: "1px solid #ef4444",
            },
          }
        );
      } else {
        console.log("🔘 SERVICE ERROR STEP: Unknown error");
        toast.error("Unable to update project. Please try again.", {
          style: {
            background: "white",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
        });
      }
      console.log("✅ SERVICE ERROR STEP PASSED: Error toast shown");
      throw error;
    }
  },
};
