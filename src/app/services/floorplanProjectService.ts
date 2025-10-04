import axiosInstance from "@/lib/axios";

// Types for the floorplan-based project creation
export interface FloorplanProjectRequest {
  file: File;
  // No estimation fields needed - AI generates everything automatically
}

export interface FloorplanProjectResponse {
  fileUrl: string;
  text: string;
  partialSummaries: string[];
  summary: string;
  // AI-generated estimation data
  totalEstimatedCost: number;
  costPerSquareFoot: number;
  estimatedDuration: number;
  laborCost: number;
  materialCost: number;
  otherExpenses: number;
  currency: string;
  numberOfWorkers: number;
  // Estimation metadata
  estimationSource: "AI_GENERATED" | "MATCHED_FROM_EXISTING";
  similarityScore?: number;
  matchedProjectId?: string;
  // Created project info
  finalProject: {
    id: string;
    status: string;
    createdAt: string;
  };
  // Optional error info when project creation fails but OCR/AI succeed
  error?: string;
  errorDetails?: unknown;
}

export interface ProjectListItem {
  id: string;
  status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;
  summary?: string;
  totalEstimatedCost?: number;
  currency?: string;
}

export interface ProjectDetails extends ProjectListItem {
  text: string;
  partialSummaries: string[];
  costPerSquareFoot?: number;
  estimatedDuration?: number;
  laborCost?: number;
  materialCost?: number;
  otherExpenses?: number;
  numberOfWorkers?: number;
  estimationSource: "AI_GENERATED" | "MATCHED_FROM_EXISTING";
  similarityScore?: number;
  matchedProjectId?: string;
}

export const floorplanProjectService = {
  // Create a new project from floorplan
  async createProject(data: FloorplanProjectRequest): Promise<FloorplanProjectResponse> {
    const formData = new FormData();
    
    // Only add the file - AI will generate everything else automatically
    formData.append('file', data.file);
    
    const response = await axiosInstance.post<FloorplanProjectResponse>(
      '/api/v1/floorplan/ocr',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  // Get all user projects
  async getAllProjects(): Promise<ProjectListItem[]> {
    const response = await axiosInstance.get<ProjectListItem[]>('/api/v1/final-project');
    return response.data;
  },

  // Get project details by ID
  async getProjectById(id: string): Promise<ProjectDetails> {
    console.log('🔍 Fetching project details for ID:', id);
    const response = await axiosInstance.get<ProjectDetails>(`/api/v1/final-project/${id}`);
    console.log('📡 Raw API response:', response.data);
    return response.data;
  },

  // Update project status
  async updateProjectStatus(id: string, status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED"): Promise<void> {
    await axiosInstance.patch(`/api/v1/final-project/${id}/status`, { status });
  },

  // Update project details
  async updateProject(id: string, data: Partial<ProjectDetails>): Promise<ProjectDetails> {
    const response = await axiosInstance.put<ProjectDetails>(`/api/v1/final-project/${id}`, data);
    return response.data;
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    await axiosInstance.delete(`/api/v1/final-project/${id}`);
  }
};
