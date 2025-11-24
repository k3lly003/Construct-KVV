import axios from "axios";
import { toast } from "sonner";
import { FormData } from "@/app/utils/fakes/formData";
import { Project } from "@/types/project";
import { toastColors } from "@/lib/design-tokens";

// Define ProjectUpdateData locally if not exported from types
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

export type ProjectStatus = "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";

interface StatusUpdateRequest {
  status: ProjectStatus;
}

import { RENDER_API_URL } from '@/lib/apiConfig';

const API_URL = RENDER_API_URL;

// Utility to safely get token from localStorage (browser-only)
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

export const convertFormDataToProjectUpdate = (
  formData: FormData
): ProjectUpdateData => {
  const features = formData?.apiResponse?.features || [];
  const extras = features.map(
    (feature: { name?: string; type?: string; count?: number }) => ({
      name: feature.name || feature.type || "feature",
      detail: { count: feature.count || 1 },
    })
  );

  if (extras.length === 0) {
    extras.push(
      { name: "garage", detail: { count: 1 } },
      { name: "garden", detail: { count: 1 } }
    );
  }

  return {
    roomsCount: formData?.bedrooms || 0,
    bathroomsCount: formData?.bathrooms || 0,
    kitchensCount: 1,
    conversationRoomsCount: 0,
    extras: extras,
    description:
      formData?.apiResponse?.description ||
      formData?.houseSummary?.fullDescription ||
      `${formData?.bedrooms || 0}-bedroom ${
        formData?.projectType || "residential"
      } home`,
    estimatedCost: Number(
      formData?.apiResponse?.estimatedCost ??
        formData?.apiResponse?.totalCost ??
        25000000
    ),
  };
};

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const authToken = getAuthToken();
    console.log(
      "[projectService] getAllProjects called with authToken:",
      authToken
    );
    if (!authToken) {
      toast.error("You are not authenticated. Please log in first.");
      throw new Error("No authentication token found");
    }
    try {
      const response = await axios.get(`${API_URL}/api/v1/final-project`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[projectService] getAllProjects response:", response);
      console.log(
        "[projectService] getAllProjects response data:",
        response.data
      );
      return response.data as Project[];
    } catch (error) {
      console.error("[projectService] getAllProjects error:", error);
      throw error;
    }
  },

  async getProjectById(id: string): Promise<Project> {
    const authToken = getAuthToken();
    console.log(
      "[projectService] getProjectById called with id:",
      id,
      "authToken:",
      authToken
    );
    if (!authToken) {
      toast.error("You are not authenticated. Please log in first.");
      throw new Error("No authentication token found");
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/final-project/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[projectService] getProjectById response:", response);
      console.log(
        "[projectService] getProjectById response data:",
        response.data
      );
      return response.data as Project;
    } catch (error) {
      const err = error as { response?: { data?: unknown; status?: number } };
      console.error("[projectService] getProjectById error:", error);
      if (err.response?.status === 404) {
        toast.error("Project not found.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      } else if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      } else {
        toast.error("Unable to fetch project details. Please try again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
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
    const authToken = getAuthToken();
    console.log(
      "[projectService] updateProject called with id:",
      id,
      "projectData:",
      projectData,
      "authToken:",
      authToken
    );
    if (!authToken) {
      toast.error("You are not authenticated. Please log in first.");
      throw new Error("No authentication token found");
    }
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/final-project/${id}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[projectService] updateProject response:", response);
      console.log(
        "[projectService] updateProject response data:",
        response.data
      );
      return response.data as Project;
    } catch (error) {
      console.error("[projectService] updateProject error:", error);
      throw error;
    }
  },

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
    const authToken = getAuthToken();
    console.log(
      "[projectService] updateProjectStatus called with id:",
      id,
      "status:",
      status,
      "authToken:",
      authToken
    );
    if (!authToken) {
      toast.error("You are not authenticated. Please log in first.");
      throw new Error("No authentication token found");
    }
    try {
      const requestBody: StatusUpdateRequest = { status };
      const response = await axios.patch(
        `${API_URL}/api/v1/final-project/${id}/status`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[projectService] updateProjectStatus response:", response);
      console.log(
        "[projectService] updateProjectStatus response data:",
        response.data
      );
      toast.success(`Project status updated to ${status} successfully! 🎉`, {
        style: {
          background: toastColors.default.bg,
          color: toastColors.default.text,
          border: `1px solid ${toastColors.default.border}`,
        },
      });
    } catch (error) {
      const err = error as { response?: { data?: unknown; status?: number } };
      console.error("[projectService] updateProjectStatus error:", error);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      } else if (err.response?.status === 404) {
        toast.error("Project not found.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      } else if (err.response?.status === 400) {
        toast.error("Invalid status value. Please try again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      } else {
        toast.error("Unable to update project status. Please try again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      }
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    const authToken = getAuthToken();
    console.log(
      "[projectService] deleteProject called with id:",
      id,
      "authToken:",
      authToken
    );
    if (!authToken) {
      toast.error("You are not authenticated. Please log in first.");
      throw new Error("No authentication token found");
    }
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/final-project/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("[projectService] deleteProject response:", response);
      toast.success("Project deleted successfully", {
        style: {
          background: toastColors.success.bg,
          color: toastColors.success.text,
          border: `1px solid ${toastColors.success.border}`,
        },
      });
    } catch (error) {
      const err = error as { response?: { data?: unknown; status?: number } };
      console.error("[projectService] deleteProject error:", error);
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      } else {
        toast.error("Unable to delete project. Please try again.", {
          style: {
            background: toastColors.error.bg,
            color: toastColors.error.text,
            border: `1px solid ${toastColors.error.border}`,
          },
        });
      }
      throw error;
    }
  },
};
