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

function cleanOCRText(text?: string): string {
  if (!text || typeof text !== "string") return "";

  return text
    .replace(/[^a-zA-Z0-9.\sx]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSpaces(text: string): string[] {
  const keywords = [
    "Kitchen",
    "Bedroom",
    "Living Room",
    "Garage",
    "Office",
    "Laundry",
    "Bathroom",
    "Dining",
  ];

  const lower = text.toLowerCase();
  return keywords.filter((word) => lower.includes(word.toLowerCase()));
}

function formatMoney(amount?: number, currency = "RWF"): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "N/A";
  return `${currency} ${amount.toLocaleString()}`;
}

function generateProjectDescription(data: {
  summary?: string;
  currency?: string;
  totalEstimatedCost?: number;
  materialCost?: number;
  laborCost?: number;
  otherExpenses?: number;
  estimatedDuration?: number;
  numberOfWorkers?: number;
}): string {
  const cleaned = cleanOCRText(data.summary);
  const spaces = extractSpaces(cleaned);

  const spacesText =
    spaces.length > 0
      ? spaces.join(", ")
      : "residential living spaces identified from the provided layout";

  const totalText = formatMoney(data.totalEstimatedCost, data.currency || "RWF");
  const materialText = formatMoney(data.materialCost, data.currency || "RWF");
  const laborText = formatMoney(data.laborCost, data.currency || "RWF");
  const otherText =
    typeof data.otherExpenses === "number"
      ? ` and other expenses around ${formatMoney(data.otherExpenses, data.currency || "RWF")}`
      : "";
  const durationText =
    typeof data.estimatedDuration === "number"
      ? `${data.estimatedDuration} month(s)`
      : "an estimated timeline to be confirmed";
  const workersText =
    typeof data.numberOfWorkers === "number"
      ? `${data.numberOfWorkers} worker(s)`
      : "a workforce size to be confirmed";

  const intro =
    cleaned.length > 0
      ? `This project appears to be a residential house plan including ${spacesText}.`
      : "This project appears to be a residential construction plan prepared from the provided floorplan.";

  return `${intro}

The estimated total cost is ${totalText}, with materials costing ${materialText} and labor costing ${laborText}${otherText}.

The project is expected to take approximately ${durationText} and will require about ${workersText}.

Overall, this is a compact and functional home design based on the provided layout.`;
}

function normalizeProjectSummary<T extends ProjectListItem | ProjectDetails>(
  project: T
): T {
  return {
    ...project,
    summary: generateProjectDescription({
      summary: project.summary,
      currency: project.currency,
      totalEstimatedCost: project.totalEstimatedCost,
      materialCost: (project as ProjectDetails).materialCost,
      laborCost: (project as ProjectDetails).laborCost,
      otherExpenses: (project as ProjectDetails).otherExpenses,
      estimatedDuration: (project as ProjectDetails).estimatedDuration,
      numberOfWorkers: (project as ProjectDetails).numberOfWorkers,
    }),
  };
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
    
    return {
      ...response.data,
      summary: generateProjectDescription(response.data),
    };
  },

  // Get all user projects
  async getAllProjects(): Promise<ProjectListItem[]> {
    const response = await axiosInstance.get<ProjectListItem[]>('/api/v1/final-project');
    return response.data.map((project) => normalizeProjectSummary(project));
  },

  // Get project details by ID
  async getProjectById(id: string): Promise<ProjectDetails> {
    console.log('🔍 Fetching project details for ID:', id);
    const response = await axiosInstance.get<ProjectDetails>(`/api/v1/final-project/${id}`);
    console.log('📡 Raw API response:', response.data);
    return normalizeProjectSummary(response.data);
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
