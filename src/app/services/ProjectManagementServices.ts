import axiosInstance from "@/lib/axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://construct-kvv-bn-fork.onrender.com";

export interface PMBudgetExpense {
  id: string;
  description: string;
  stage: "Foundation" | "Roofing" | "Finishing" | string;
  createdAt: string;
  finalProjectId: string;
  expenseAmount: number;
}

export interface PMBudgetSummary {
  expenses: PMBudgetExpense[];
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

export async function getBudgetByProjectId(
  token: string,
  finalProjectId: string
): Promise<PMBudgetSummary | null> {
  const url = `${API_BASE_URL}/api/v1/budget/${finalProjectId}`;
  try {
    const response = await axiosInstance.get<PMBudgetSummary>(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "[ProjectManagementServices] getBudgetByProjectId: ERROR",
      error
    );
    return null;
  }
}

export interface PMMilestone {
  id: string;
  foundation: number;
  roofing: number;
  finishing: number;
  createdAt: string;
  updatedAt: string;
  finalProjectId: string;
}

export async function getMilestonesByProjectId(
  token: string,
  finalProjectId: string
): Promise<PMMilestone[] | null> {
  const url = `${API_BASE_URL}/api/v1/milestones/project/${finalProjectId}`;
  try {
    const response = await axiosInstance.get<PMMilestone[]>(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error(
      "[ProjectManagementServices] getMilestonesByProjectId: ERROR",
      error
    );
    return null;
  }
}

export interface PMTimeline {
  id: string;
  startedAt: string;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
  finalProjectId: string;
}

export async function getTimelinesByProjectId(
  token: string,
  finalProjectId: string
): Promise<PMTimeline[] | null> {
  const url = `${API_BASE_URL}/api/v1/timelines/project/${finalProjectId}`;
  try {
    const response = await axiosInstance.get<PMTimeline[]>(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error(
      "[ProjectManagementServices] getTimelinesByProjectId: ERROR",
      error
    );
    return null;
  }
}
