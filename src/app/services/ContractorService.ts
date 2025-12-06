import axiosInstance from "@/lib/axios";

import { RENDER_API_URL, NEXT_PUBLIC_API_URL_2 } from '@/lib/apiConfig';

const API_BASE_URL = RENDER_API_URL;
const RAILWAY_BASE_URL = NEXT_PUBLIC_API_URL_2;

export interface ContractorProject {
  id: string;
  status: string;
  ownerId: string;
  choosenEstimationId: string | null;
  createdAt: string;
  costPerSquareFoot: number;
  currency: string;
  estimatedDuration: number;
  estimationSource: string;
  fileUrl: string;
  laborCost: number;
  matchedProjectId: string | null;
  materialCost: number;
  numberOfWorkers: number;
  ocrText: string;
  otherExpenses: number;
  partialSummaries: string[];
  similarityScore: number;
  summary: string;
  totalEstimatedCost: number;
  choosenEstimation: any;
  owner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    profilePic?: string;
  };
  bids: Bid[];
}

export interface Bid {
  id: string;
  amount: number;
  message: string;
  status: string;
  agreedToTerms: boolean;
  createdAt: string;
  updatedAt: string;
  finalProjectId: string;
  contractorId: string;
}

export interface MilestonePayload {
  foundation: number;
  roofing: number;
  finishing: number;
}

export interface Milestone extends MilestonePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
  finalProjectId: string;
}

export interface TimelinePayload {
  startedAt: string; // ISO string
  endedAt: string; // ISO string
}

export interface Timeline extends TimelinePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
  finalProjectId: string;
}

export interface BudgetExpensePayload {
  description: string;
  stage: "Foundation" | "Roofing" | "Finishing";
  expenseAmount: number;
}

export interface BudgetExpense extends BudgetExpensePayload {
  id: string;
  createdAt: string;
  finalProjectId: string;
}

export interface BudgetSummary {
  expenses: BudgetExpense[];
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

async function getAuthenticatedContractorId(token: string): Promise<string> {
  const maskedToken = token
    ? `${token.slice(0, 6)}...${token.slice(-4)}`
    : "<none>";
  const url = `${API_BASE_URL}/api/v1/contractors/profile/me`;
  console.log("[ContractorService] getAuthenticatedContractorId: INIT", {
    apiBase: API_BASE_URL,
    url,
    tokenMasked: maskedToken,
    method: "GET",
  });
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data?: { id?: string };
    }>(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "[ContractorService] getAuthenticatedContractorId: RESPONSE META",
      {
        status: response.status,
        statusText: response.statusText,
        url: response.config?.url,
        method: response.config?.method,
        headers: response.headers,
      }
    );
    console.log(
      "[ContractorService] getAuthenticatedContractorId: RESPONSE DATA",
      response.data
    );
    try {
      console.dir(response, { depth: null });
    } catch {}

    const contractorId = response?.data?.data?.id;
    if (!contractorId) {
      throw new Error(
        "Authenticated contractor id not found in profile response"
      );
    }
    console.log("[ContractorService] getAuthenticatedContractorId: SUCCESS", {
      authenticatedContractorId: contractorId,
    });
    return contractorId as string;
  } catch (error) {
    console.error(
      "[ContractorService] getAuthenticatedContractorId: ERROR",
      error
    );
    throw error;
  }
}

export async function getContractorProjects(
  token: string,
  contractorId: string
): Promise<ContractorProject[]> {
  try {
    const maskedToken = token
      ? `${token.slice(0, 6)}...${token.slice(-4)}`
      : "<none>";
    // Resolve the authenticated contractor id from API (ignore local id)
    const authenticatedContractorId = await getAuthenticatedContractorId(token);
    const url = `${API_BASE_URL}/api/v1/final-project/get-all`;
    // Debug: request details
    console.log("[ContractorService] getContractorProjects: INIT", {
      apiBase: API_BASE_URL,
      url,
      contractorIdParam: contractorId,
      authenticatedUserId: authenticatedContractorId,
      tokenMasked: maskedToken,
      method: "POST",
      body: {},
    });

    const response = await axiosInstance.post(
      url,
      {},
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Log a comprehensive view of the response
    console.log("[ContractorService] getContractorProjects: RESPONSE META", {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url,
      method: response.config?.method,
      headers: response.headers,
    });
    console.log(
      "[ContractorService] getContractorProjects: RESPONSE DATA",
      response.data
    );
    // For deep inspection during debugging
    try {
      console.dir(response, { depth: null });
    } catch {}
    // Filter for closed projects where the contractor is in an accepted bid
    const allProjects = response.data as ContractorProject[];
    const filtered = allProjects.filter(
      (project) =>
        project.status === "CLOSED" &&
        Array.isArray(project.bids) &&
        project.bids.some(
          (bid) =>
            bid.contractorId === authenticatedContractorId &&
            bid.status === "ACCEPTED"
        )
    );
    console.log("[ContractorService] getContractorProjects: FILTERED", {
      returned: filtered.length,
      authenticatedContractorId,
    });
    return filtered;
  } catch (error) {
    console.error("[ContractorService] getContractorProjects: ERROR", error);
    throw error;
  }
}

export async function getMilestoneByProject(
  token: string,
  finalProjectId: string
): Promise<Milestone | null> {
  const url = `${API_BASE_URL}/api/v1/milestones/project/${finalProjectId}`;
  const maskedToken = token
    ? `${token.slice(0, 6)}...${token.slice(-4)}`
    : "<none>";
  console.log("[ContractorService] getMilestoneByProject: INIT", {
    url,
    finalProjectId,
    tokenMasked: maskedToken,
  });
  try {
    const response = await axiosInstance.get<Milestone[]>(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[ContractorService] getMilestoneByProject: RESPONSE", {
      status: response.status,
      data: response.data,
    });
    const list = response.data || [];
    return list.length > 0 ? list[0] : null;
  } catch (error) {
    console.error("[ContractorService] getMilestoneByProject: ERROR", error);
    return null;
  }
}

export async function upsertMilestone(
  token: string,
  finalProjectId: string,
  payload: MilestonePayload
): Promise<Milestone> {
  const existing = await getMilestoneByProject(token, finalProjectId);
  if (existing) {
    const url = `${API_BASE_URL}/api/v1/milestones/${existing.id}`;
    console.log("[ContractorService] upsertMilestone: PUT INIT", {
      url,
      finalProjectId,
      milestoneId: existing.id,
      payload,
    });
    const response = await axiosInstance.put<Milestone>(url, payload, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "[ContractorService] upsertMilestone: PUT RESPONSE",
      response.data
    );
    return response.data;
  }

  const url = `${API_BASE_URL}/api/v1/milestones`;
  const body = { ...payload, finalProjectId };
  console.log("[ContractorService] upsertMilestone: POST INIT", { url, body });
  const response = await axiosInstance.post<Milestone>(url, body, {
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(
    "[ContractorService] upsertMilestone: POST RESPONSE",
    response.data
  );
  return response.data;
}

export async function getTimelineByProject(
  token: string,
  finalProjectId: string
): Promise<Timeline | null> {
  const url = `${API_BASE_URL}/api/v1/timelines/project/${finalProjectId}`;
  const maskedToken = token
    ? `${token.slice(0, 6)}...${token.slice(-4)}`
    : "<none>";
  console.log("[ContractorService] getTimelineByProject: INIT", {
    url,
    finalProjectId,
    tokenMasked: maskedToken,
  });
  try {
    const response = await axiosInstance.get<Timeline[]>(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[ContractorService] getTimelineByProject: RESPONSE", {
      status: response.status,
      data: response.data,
    });
    const list = response.data || [];
    return list.length > 0 ? list[0] : null;
  } catch (error) {
    console.error("[ContractorService] getTimelineByProject: ERROR", error);
    return null;
  }
}

export async function upsertTimeline(
  token: string,
  finalProjectId: string,
  payload: TimelinePayload
): Promise<Timeline> {
  const existing = await getTimelineByProject(token, finalProjectId);
  if (existing) {
    const url = `${API_BASE_URL}/api/v1/timelines/${existing.id}`;
    console.log("[ContractorService] upsertTimeline: PUT INIT", {
      url,
      finalProjectId,
      timelineId: existing.id,
      payload,
    });
    const response = await axiosInstance.put<Timeline>(url, payload, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "[ContractorService] upsertTimeline: PUT RESPONSE",
      response.data
    );
    return response.data;
  }

  const url = `${API_BASE_URL}/api/v1/timelines`;
  const body = { ...payload, finalProjectId };
  console.log("[ContractorService] upsertTimeline: POST INIT", { url, body });
  const response = await axiosInstance.post<Timeline>(url, body, {
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(
    "[ContractorService] upsertTimeline: POST RESPONSE",
    response.data
  );
  return response.data;
}

export async function getBudgetByProject(
  token: string,
  finalProjectId: string
): Promise<BudgetSummary | null> {
  const url = `${API_BASE_URL}/api/v1/budget/${finalProjectId}`;
  const maskedToken = token
    ? `${token.slice(0, 6)}...${token.slice(-4)}`
    : "<none>";
  console.log("[ContractorService] getBudgetByProject: INIT", {
    url,
    finalProjectId,
    tokenMasked: maskedToken,
  });
  try {
    const response = await axiosInstance.get<BudgetSummary>(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[ContractorService] getBudgetByProject: RESPONSE", {
      status: response.status,
      data: response.data,
    });
    return response.data;
  } catch (error) {
    console.error("[ContractorService] getBudgetByProject: ERROR", error);
    return null;
  }
}

export async function createBudgetExpense(
  token: string,
  finalProjectId: string,
  payload: BudgetExpensePayload
): Promise<BudgetExpense> {
  const url = `${API_BASE_URL}/api/v1/budget/${finalProjectId}`;
  console.log("[ContractorService] createBudgetExpense: POST INIT", {
    url,
    finalProjectId,
    payload,
  });
  const response = await axiosInstance.post<BudgetExpense>(url, payload, {
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(
    "[ContractorService] createBudgetExpense: POST RESPONSE",
    response.data
  );
  return response.data;
}
