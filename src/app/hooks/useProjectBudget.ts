import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Expense {
  id: string;
  description: string;
  stage: string;
  createdAt: string;
  finalProjectId: string;
  expenseAmount: number;
}

export interface BudgetData {
  expenses: Expense[];
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

export function useProjectBudget(projectId: string) {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!projectId || !authToken || !API_URL) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/budget/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        accept: "*/*",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch budget");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { data, loading, error };
}

// New hook for milestones
export function useProjectMilestones(projectId: string) {
  const [milestones, setMilestones] = useState({
    foundation: 0,
    roofing: 0,
    finishing: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!projectId || !authToken || !API_URL) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/milestones/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        accept: "*/*",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch milestones");
        return res.json();
      })
      .then((result) => {
        if (Array.isArray(result) && result.length > 0) {
          setMilestones({
            foundation: result[0].foundation || 0,
            roofing: result[0].roofing || 0,
            finishing: result[0].finishing || 0,
          });
        } else {
          setMilestones({ foundation: 0, roofing: 0, finishing: 0 });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { milestones, loading, error };
}

// New hook for timeline
export function useProjectTimeline(projectId: string) {
  const [timeline, setTimeline] = useState<{
    startedAt: string | null;
    endedAt: string | null;
  }>({
    startedAt: null,
    endedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!projectId || !authToken || !API_URL) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/timelines/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        accept: "*/*",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch timeline");
        return res.json();
      })
      .then((result) => {
        if (Array.isArray(result) && result.length > 0) {
          setTimeline({
            startedAt: result[0].startedAt || null,
            endedAt: result[0].endedAt || null,
          });
        } else {
          setTimeline({ startedAt: null, endedAt: null });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { timeline, loading, error };
}
