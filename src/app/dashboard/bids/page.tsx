"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Funnel, Plus, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dummyOrders } from "../../utils/fakes/ProductFakes";
import Link from "next/link";
import ProgressTracker from "@/app/(components)/projects/ProgressTracker";
import {
  useProjectBudget,
  useProjectMilestones,
  useProjectTimeline,
} from "@/app/hooks/useProjectBudget";
import { projectService } from "@/app/services/projectServices";
import { Project, ProjectStatus } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// import { Pagination } from '@/components/ui/pagination'; // Assuming you'll create this
import { useRef } from "react";
import { calculateOverExpense } from "@/app/utils/overExpense";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { NegotiationChat } from "@/app/dashboard/(components)/negotiation/NegotiationChat";
import { workers } from "@/app/utils/fakes/workersFakes";
import { useTranslations } from '@/app/hooks/useTranslations';

// Temporary Pagination component implementation
interface PaginationProps {
  total: number;
  current: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ total, current, onPageChange }: PaginationProps) => {
  if (total <= 1) return null;
  return (
    <div className="flex space-x-1">
      <GenericButton
        className="px-2 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
      >
        Prev
      </GenericButton>
      {Array.from({ length: total }, (_, i) => (
        <GenericButton
          key={i + 1}
          className={`px-2 py-1 border rounded ${
            current === i + 1 ? "bg-primary text-white" : ""
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </GenericButton>
      ))}
      <GenericButton
        className="px-2 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
      >
        Next
      </GenericButton>
    </div>
  );
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const { t } = useTranslations();
  // State for tabs
  const [activeTab, setActiveTab] = useState("budgetExpense");
  // State for projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contractor bids state
  const [bids, setBids] = useState<any[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  // Metrics
  const projectsBidOn = bids.length;
  const acceptedCount = bids.filter((bid) => bid.status === "ACCEPTED").length;
  const rejectedCount = bids.filter((bid) => bid.status === "REJECTED").length;
  const withdrawnCount = bids.filter(
    (bid) => bid.status === "WITHDRAWN"
  ).length;

  // --- New State for Available Projects ---
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  // Project details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsProject, setDetailsProject] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // --- State for Place Bid Modal ---
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidProject, setBidProject] = useState<any | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidAgreed, setBidAgreed] = useState(false);
  const [placingBid, setPlacingBid] = useState(false);
  const [bidAmountError, setBidAmountError] = useState<string | null>(null);
  const [bidMessageError, setBidMessageError] = useState<string | null>(null);

  // --- Milestone Modal State ---
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [milestoneBid, setMilestoneBid] = useState<any | null>(null);
  const [milestoneData, setMilestoneData] = useState({
    foundation: "",
    roofing: "",
    finishing: "",
  });
  const [milestoneId, setMilestoneId] = useState<string | null>(null);
  const [milestoneLoading, setMilestoneLoading] = useState(false);

  // --- Budget & Expense Modal State ---
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetBid, setBudgetBid] = useState<any | null>(null);
  const [budgetData, setBudgetData] = useState({
    description: "",
    stage: "",
    expenseAmount: "",
  });
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetEntries, setBudgetEntries] = useState<any[]>([]);

  // --- Timeline Modal State ---
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineBid, setTimelineBid] = useState<any | null>(null);
  const [timelineData, setTimelineData] = useState({
    startedAt: "",
    endedAt: "",
  });
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  // --- Negotiation Drawer State ---
  const [negotiationDrawerOpen, setNegotiationDrawerOpen] = useState(false);
  const [negotiationBid, setNegotiationBid] = useState<any | null>(null);

  // --- Assign Specialist Modal State ---
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignBid, setAssignBid] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [assignedWorkers, setAssignedWorkers] = useState<{
    [bidId: string]: { role: string; worker: any }[];
  }>({});

  // Load assigned workers from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("assignedWorkers");
      if (stored) setAssignedWorkers(JSON.parse(stored));
    }
  }, []);
  // Save assigned workers to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("assignedWorkers", JSON.stringify(assignedWorkers));
    }
  }, [assignedWorkers]);

  const specialistRoles = [
    "Architect",
    "Plumber",
    "Painter",
    "Electrician",
    "Contractor",
    "Landscaper",
    "Interior Designer",
    "General Contractor",
  ];

  function openAssignModal(bid: any) {
    setAssignBid(bid);
    setSelectedRole("");
    setSelectedWorkerId("");
    setAssignModalOpen(true);
  }

  function handleAssignWorker() {
    if (!assignBid || !selectedRole || !selectedWorkerId) return;
    const worker = workers.find((w) => w.id === selectedWorkerId);
    if (!worker) return;
    setAssignedWorkers((prev) => {
      const prevArr = prev[assignBid.id] || [];
      // Prevent duplicate role assignment
      const filtered = prevArr.filter((aw) => aw.role !== selectedRole);
      return {
        ...prev,
        [assignBid.id]: [...filtered, { role: selectedRole, worker }],
      };
    });
    setAssignModalOpen(false);
  }

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const data = await projectService.getAllProjects();
        setProjects(data);
        console.log("Projects in bids", data);
      } catch (e: any) {
        setError(e.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchBids() {
      setBidsLoading(true);
      setBidsError(null);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token || !API_URL) throw new Error("No auth token or API URL");
        const res = await fetch(`${API_URL}/api/v1/bids/contractor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        setBids(data.data || []);
        console.log("Bids", data.data);
      } catch (e: any) {
        setBidsError(e.message || "Failed to load bids");
      } finally {
        setBidsLoading(false);
      }
    }
    fetchBids();
  }, []);

  // --- Fetch Available Projects to Bid On ---
  useEffect(() => {
    async function fetchAvailableProjects() {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token || !API_URL) throw new Error("No auth token or API URL");
        // Use new endpoint to fetch only OPEN projects
        const res = await fetch(`${API_URL}/api/v1/final-project/open`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch available projects");
        const data = await res.json();
        setAvailableProjects(data || []);
        console.log("Available projects", data);
      } catch (e: any) {
        setProjectsError(e.message || "Failed to load available projects");
      } finally {
        setProjectsLoading(false);
      }
    }
    fetchAvailableProjects();
  }, []);

  // --- Handlers to view details modal ---
  async function openProjectDetails(projectId: string) {
    setDetailsError(null);
    setDetailsLoading(true);
    setDetailsProject(null);
    setDetailsOpen(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      const res = await fetch(`${API_URL}/api/v1/final-project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch project details");
      const data = await res.json();
      setDetailsProject(data);
    } catch (e: any) {
      setDetailsError(e.message || "Failed to load project details");
    } finally {
      setDetailsLoading(false);
    }
  }

  // --- Withdraw Bid Handler (PATCH) ---
  async function withdrawBid(bidId: string) {
    setWithdrawing(bidId);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      const res = await fetch(`${API_URL}/api/v1/bids/${bidId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "WITHDRAWN" }),
      });
      if (!res.ok) throw new Error("Failed to withdraw bid");
      const withdrawResult = await res.json();
      console.log("Withdraw response", withdrawResult);
      toast.success("Bid withdrawn successfully!");
      // Refresh bids
      setBidsLoading(true);
      setBidsError(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/bids/contractor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        setBids(data.data || []);
        console.log("Refreshed bids after withdraw", data.data);
      } catch (e: any) {
        setBidsError(e.message || "Failed to load bids");
      } finally {
        setBidsLoading(false);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to withdraw bid");
    } finally {
      setWithdrawing(null);
    }
  }

  // --- Place Bid Handler ---
  async function handlePlaceBid(e: React.FormEvent) {
    e.preventDefault();
    if (!bidProject) return;
    // --- Validation ---
    let hasError = false;
    setBidAmountError(null);
    setBidMessageError(null);
    const amountNum = Number(bidAmount);
    if (isNaN(amountNum) || amountNum < 100000) {
      setBidAmountError("Bid amount must be at least 100,000 RWF");
      hasError = true;
    }
    if (!bidMessage.trim()) {
      setBidMessageError("Message is required");
      hasError = true;
    }
    if (hasError) return;
    setPlacingBid(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      const payload = {
        finalProjectId: bidProject.id,
        amount: Number(bidAmount),
        message: bidMessage,
        agreedToTerms: bidAgreed,
      };
      const res = await fetch(`${API_URL}/api/v1/bids`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to place bid");
      toast.success("Bid placed successfully!");
      setBidModalOpen(false);
      setBidProject(null);
      setBidAmount("");
      setBidMessage("");
      setBidAgreed(false);
      // Refresh bids and available projects
      // Fetch bids
      setBidsLoading(true);
      setBidsError(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/bids/contractor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        setBids(data.data || []);
      } catch (e: any) {
        setBidsError(e.message || "Failed to load bids");
      } finally {
        setBidsLoading(false);
      }
      // Fetch available projects
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/final-project/open`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch available projects");
        const data = await res.json();
        setAvailableProjects(data || []);
      } catch (e: any) {
        setProjectsError(e.message || "Failed to load available projects");
      } finally {
        setProjectsLoading(false);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to place bid");
    } finally {
      setPlacingBid(false);
    }
  }

  // --- Open Place Bid Modal ---
  function openBidModal(project: any) {
    setBidProject(project);
    setBidModalOpen(true);
    setBidAmount("");
    setBidMessage("");
    setBidAgreed(false);
  }

  // --- Open Milestone Modal ---
  async function openMilestoneModal(bid: any) {
    setMilestoneBid(bid);
    setMilestoneModalOpen(true);
    setMilestoneData({ foundation: "", roofing: "", finishing: "" });
    setMilestoneId(null);
    // Fetch existing milestone for this project (if any)
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      setMilestoneLoading(true);
      // Use the new endpoint
      const res = await fetch(
        `${API_URL}/api/v1/milestones/project/${bid.finalProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        // The backend returns an array. If empty, no milestone. If not, use the first one.
        if (Array.isArray(data) && data.length > 0) {
          const m = data[0];
          setMilestoneData({
            foundation: m.foundation?.toString() || "",
            roofing: m.roofing?.toString() || "",
            finishing: m.finishing?.toString() || "",
          });
          setMilestoneId(m.id);
        }
        // If array is empty, milestoneId remains null (will trigger create on submit)
      }
    } catch (e) {
      // ignore error, treat as no milestone
    } finally {
      setMilestoneLoading(false);
    }
  }

  // --- Submit Milestone ---
  async function handleMilestoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!milestoneBid) return;
    setMilestoneLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      // Always build the base payload
      const basePayload = {
        foundation: Number(milestoneData.foundation),
        roofing: Number(milestoneData.roofing),
        finishing: Number(milestoneData.finishing),
      };
      let res, result;
      if (milestoneId) {
        // Update: do NOT send finalProjectId
        res = await fetch(`${API_URL}/api/v1/milestones/${milestoneId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(basePayload),
        });
        result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to update milestone");
        toast.success("Milestone updated successfully!");
      } else {
        // Create: include finalProjectId
        const payload = {
          ...basePayload,
          finalProjectId: milestoneBid.finalProjectId,
        };
        res = await fetch(`${API_URL}/api/v1/milestones`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to create milestone");
        toast.success("Milestone created successfully!");
        setMilestoneId(result.data?.id || null);
      }
      setMilestoneModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save milestone");
    } finally {
      setMilestoneLoading(false);
    }
  }

  // --- Open Budget Modal ---
  async function openBudgetModal(bid: any) {
    setBudgetBid(bid);
    setBudgetModalOpen(true);
    setBudgetData({ description: "", stage: "", expenseAmount: "" });
    setBudgetEntries([]);
    // Fetch existing budget/expense entries for this project (if any)
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      setBudgetLoading(true);
      const res = await fetch(
        `${API_URL}/api/v1/budget/${bid.finalProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          setBudgetEntries(Array.isArray(data.data) ? data.data : [data.data]);
        }
      }
    } catch (e) {
      // ignore error, treat as no budget entries
    } finally {
      setBudgetLoading(false);
    }
  }

  // --- Submit Budget/Expense ---
  async function handleBudgetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!budgetBid) return;
    setBudgetLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      const payload = {
        description: budgetData.description,
        stage: budgetData.stage,
        expenseAmount: Number(budgetData.expenseAmount),
      };
      const res = await fetch(
        `${API_URL}/api/v1/budget/${budgetBid.finalProjectId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.message || "Failed to create budget/expense entry"
        );
      toast.success("Budget/Expense entry created successfully!");
      setBudgetModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save budget/expense entry");
    } finally {
      setBudgetLoading(false);
    }
  }

  // --- Open Timeline Modal ---
  async function openTimelineModal(bid: any) {
    setTimelineBid(bid);
    setTimelineModalOpen(true);
    setTimelineData({ startedAt: "", endedAt: "" });
    setTimelineId(null);
    setTimelineError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      setTimelineLoading(true);
      const res = await fetch(
        `${API_URL}/api/v1/timelines/project/${bid.finalProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const t = data[0];
          setTimelineData({
            startedAt: t.startedAt ? t.startedAt.slice(0, 16) : "",
            endedAt: t.endedAt ? t.endedAt.slice(0, 16) : "",
          });
          setTimelineId(t.id);
        }
      }
    } catch (e) {
      // ignore error, treat as no timeline
    } finally {
      setTimelineLoading(false);
    }
  }

  // --- Submit Timeline ---
  async function handleTimelineSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!timelineBid) return;
    setTimelineLoading(true);
    setTimelineError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token || !API_URL) throw new Error("No auth token or API URL");
      const basePayload = {
        startedAt: new Date(timelineData.startedAt).toISOString(),
        endedAt: new Date(timelineData.endedAt).toISOString(),
      };
      let res, result;
      if (timelineId) {
        res = await fetch(`${API_URL}/api/v1/timelines/${timelineId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(basePayload),
        });
        result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to update timeline");
        toast.success("Timeline updated successfully!");
      } else {
        const payload = {
          ...basePayload,
          finalProjectId: timelineBid.finalProjectId,
        };
        res = await fetch(`${API_URL}/api/v1/timelines`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to create timeline");
        toast.success("Timeline created successfully!");
        setTimelineId(result.data?.id || null);
      }
      setTimelineModalOpen(false);
    } catch (e: any) {
      setTimelineError(e.message || "Failed to save timeline");
      toast.error(e.message || "Failed to save timeline");
    } finally {
      setTimelineLoading(false);
    }
  }

  // Tab content renderers
  const renderTabContent = () => {
    if (loading) return <div className="text-amber-600 p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;
    switch (activeTab) {
      case "budgetExpense":
        // List all accepted bids (status === 'ACCEPTED')
        const acceptedBidsBudget = bids.filter(
          (bid) => bid.status === "ACCEPTED"
        );
        return (
          <>
            {/* Budget & Expense Modal */}
            <Dialog open={budgetModalOpen} onOpenChange={setBudgetModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.manageBudgetExpense')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="description">{t('dashboard.description')}</Label>
                    <input
                      id="description"
                      type="text"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={budgetData.description}
                      onChange={(e) =>
                        setBudgetData((d) => ({
                          ...d,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stage">{t('dashboard.stage')}</Label>
                    <select
                      id="stage"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={budgetData.stage}
                      onChange={(e) =>
                        setBudgetData((d) => ({ ...d, stage: e.target.value }))
                      }
                      required
                    >
                      <option value="">{t('dashboard.selectStage')}</option>
                      <option value="Foundation">{t('dashboard.foundation')}</option>
                      <option value="Roofing">{t('dashboard.roofing')}</option>
                      <option value="Finishing">{t('dashboard.finishing')}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="expenseAmount">{t('dashboard.expenseAmount')}</Label>
                    <input
                      id="expenseAmount"
                      type="number"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={budgetData.expenseAmount}
                      onChange={(e) =>
                        setBudgetData((d) => ({
                          ...d,
                          expenseAmount: e.target.value,
                        }))
                      }
                      required
                      min={0}
                    />
                    {budgetData.expenseAmount &&
                      Number(budgetData.expenseAmount) < 5000 && (
                        <div className="text-red-600 text-xs mt-1">
                          {t('dashboard.expenseAmountMustBeAtLeast')}
                        </div>
                      )}
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      className="px-4 py-2 rounded border"
                      onClick={() => setBudgetModalOpen(false)}
                      disabled={budgetLoading}
                    >
                      {t('dashboard.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                      disabled={
                        budgetLoading || Number(budgetData.expenseAmount) < 5000
                      }
                    >
                      {budgetLoading ? "Saving..." : t('dashboard.createEntry')}
                    </button>
                  </DialogFooter>
                </form>
                {/* List existing budget/expense entries */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">{t('dashboard.existingBudgetExpenseEntries')}</h3>
                  {budgetLoading ? (
                    <div className="text-amber-600">Loading...</div>
                  ) : budgetEntries.length === 0 ? (
                    <div className="text-gray-500 italic">
                      {t('dashboard.noEntriesFound')}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {budgetEntries.map((entry, idx) => {
                        const bidBudgetEntries = budgetEntries.filter(
                          (e) => e.finalProjectId === entry.finalProjectId
                        );
                        const totalExpense = bidBudgetEntries.reduce(
                          (sum, e) => sum + Number(e.expenseAmount),
                          0
                        );
                        const { overSpent, percentUsed } = calculateOverExpense(
                          bidBudgetEntries,
                          entry.amount
                        );
                        return (
                          <li
                            key={entry.id || idx}
                            className="border rounded p-2"
                          >
                            <div>
                              <span className="font-semibold">
                                {t('dashboard.description')}:
                              </span>{" "}
                              {entry.description}
                            </div>
                            <div>
                              <span className="font-semibold">{t('dashboard.stage')}:</span>{" "}
                              {entry.stage}
                            </div>
                            <div>
                              <span className="font-semibold">{t('dashboard.amount')}:</span>{" "}
                              {entry.expenseAmount?.toLocaleString()} RWF
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold">
                                {percentUsed}% {t('dashboard.used')}
                              </span>
                              {overSpent && (
                                <span className="text-red-600 font-bold ml-2">
                                  ({t('dashboard.overSpent')})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{t('dashboard.remaining')}:</span>
                              <span
                                className={
                                  overSpent
                                    ? "text-red-600 font-bold"
                                    : "text-amber-800 font-bold"
                                }
                              >
                                {overSpent
                                  ? 0
                                  : (
                                      entry.amount - totalExpense
                                    ).toLocaleString()}{" "}
                                RWF
                              </span>
                              {overSpent && (
                                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  {t('dashboard.overSpent')}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <div className="p-6 flex flex-col gap-8">
              <h2 className="text-xl font-bold text-amber-800 mb-4">
                {t('dashboard.budgetExpenseManagement')}
              </h2>
              {acceptedBidsBudget.length === 0 ? (
                <div className="text-amber-700">
                  {t('dashboard.noAssignedProjectsFound')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {acceptedBidsBudget.map((bid) => {
                    const bidBudgetEntries = budgetEntries.filter(
                      (e) => e.finalProjectId === bid.finalProjectId
                    );
                    const totalExpense = bidBudgetEntries.reduce(
                      (sum, entry) => sum + Number(entry.expenseAmount),
                      0
                    );
                    const { overSpent, percentUsed } = calculateOverExpense(
                      bidBudgetEntries,
                      bid.amount
                    );
                    return (
                      <div
                        key={bid.id}
                        className="bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                      >
                        <div className="font-bold text-amber-800 mb-2">
                          {t('dashboard.projectId')}:{" "}
                          <span className="font-mono">
                            {bid.finalProjectId}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">{t('dashboard.bidAmount')}:</span>{" "}
                          {bid.amount?.toLocaleString()} RWF
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.acceptedAt')}:{" "}
                          {new Date(
                            bid.updatedAt || bid.createdAt
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.message')}: {bid.message}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.owner')}: {bid.finalProject?.ownerId}
                        </div>
                        <button
                          className="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                          onClick={() => openBudgetModal(bid)}
                          disabled={budgetLoading}
                        >
                          {t('dashboard.manageBudgetExpense')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        );
      case "milestone":
        // List all accepted bids (status === 'ACCEPTED')
        const acceptedBids = bids.filter((bid) => bid.status === "ACCEPTED");
        return (
          <>
            {/* Milestone Modal */}
            <Dialog
              open={milestoneModalOpen}
              onOpenChange={setMilestoneModalOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.manageMilestones')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="foundation">{t('dashboard.foundation')}</Label>
                    <input
                      id="foundation"
                      type="number"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={milestoneData.foundation}
                      onChange={(e) =>
                        setMilestoneData((d) => ({
                          ...d,
                          foundation: e.target.value,
                        }))
                      }
                      required
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roofing">{t('dashboard.roofing')}</Label>
                    <input
                      id="roofing"
                      type="number"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={milestoneData.roofing}
                      onChange={(e) =>
                        setMilestoneData((d) => ({
                          ...d,
                          roofing: e.target.value,
                        }))
                      }
                      required
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="finishing">{t('dashboard.finishing')}</Label>
                    <input
                      id="finishing"
                      type="number"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={milestoneData.finishing}
                      onChange={(e) =>
                        setMilestoneData((d) => ({
                          ...d,
                          finishing: e.target.value,
                        }))
                      }
                      required
                      min={0}
                      max={100}
                    />
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      className="px-4 py-2 rounded border"
                      onClick={() => setMilestoneModalOpen(false)}
                      disabled={milestoneLoading}
                    >
                      {t('dashboard.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                      disabled={milestoneLoading}
                    >
                      {milestoneLoading
                        ? "Saving..."
                        : milestoneId
                        ? t('dashboard.updateMilestone')
                        : t('dashboard.createMilestone')}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="p-6">
              <h2 className="text-xl font-bold text-amber-800 mb-4">
                {t('dashboard.assignedProjectsAcceptedBids')}
              </h2>
              {bidsLoading ? (
                <div className="text-amber-600">Loading bids...</div>
              ) : bidsError ? (
                <div className="text-red-500">{bidsError}</div>
              ) : acceptedBids.length === 0 ? (
                <div className="text-amber-700">
                  {t('dashboard.noAssignedProjectsFound')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {acceptedBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                    >
                      <div className="font-bold text-amber-800 mb-2">
                        {t('dashboard.projectId')}:{" "}
                        <span className="font-mono">{bid.finalProjectId}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">{t('dashboard.bidAmount')}:</span>{" "}
                        {bid.amount?.toLocaleString()} RWF
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {t('dashboard.acceptedAt')}:{" "}
                        {new Date(
                          bid.updatedAt || bid.createdAt
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {t('dashboard.message')}: {bid.message}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {t('dashboard.owner')}: {bid.finalProject?.ownerId}
                      </div>
                      <button
                        className="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                        onClick={() => openMilestoneModal(bid)}
                        disabled={milestoneLoading}
                      >
                        {t('dashboard.manageMilestones')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      case "timeline":
        // List all accepted bids (status === 'ACCEPTED')
        const acceptedBidsTimeline = bids.filter(
          (bid) => bid.status === "ACCEPTED"
        );
        return (
          <>
            {/* Timeline Modal */}
            <Dialog
              open={timelineModalOpen}
              onOpenChange={setTimelineModalOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.manageTimeline')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTimelineSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="startedAt">{t('dashboard.startDate')}</Label>
                    <input
                      id="startedAt"
                      type="datetime-local"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={timelineData.startedAt}
                      onChange={(e) =>
                        setTimelineData((d) => ({
                          ...d,
                          startedAt: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endedAt">{t('dashboard.endDate')}</Label>
                    <input
                      id="endedAt"
                      type="datetime-local"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={timelineData.endedAt}
                      onChange={(e) =>
                        setTimelineData((d) => ({
                          ...d,
                          endedAt: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  {timelineError && (
                    <div className="text-red-500 text-xs">{timelineError}</div>
                  )}
                  <DialogFooter>
                    <button
                      type="button"
                      className="px-4 py-2 rounded border"
                      onClick={() => setTimelineModalOpen(false)}
                      disabled={timelineLoading}
                    >
                      {t('dashboard.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                      disabled={timelineLoading}
                    >
                      {timelineLoading
                        ? "Saving..."
                        : timelineId
                        ? t('dashboard.updateTimeline')
                        : t('dashboard.createTimeline')}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="p-6">
              <h2 className="text-xl font-bold text-amber-800 mb-4">
                {t('dashboard.assignedProjectsAcceptedBids')}
              </h2>
              {bidsLoading ? (
                <div className="text-amber-600">Loading bids...</div>
              ) : bidsError ? (
                <div className="text-red-500">{bidsError}</div>
              ) : acceptedBidsTimeline.length === 0 ? (
                <div className="text-amber-700">
                  {t('dashboard.noAssignedProjectsFound')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {acceptedBidsTimeline.map((bid) => (
                    <div
                      key={bid.id}
                      className="bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                    >
                      <div className="font-bold text-amber-800 mb-2">
                        {t('dashboard.projectId')}:{" "}
                        <span className="font-mono">{bid.finalProjectId}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">{t('dashboard.bidAmount')}:</span>{" "}
                        {bid.amount?.toLocaleString()} RWF
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {t('dashboard.acceptedAt')}:{" "}
                        {new Date(
                          bid.updatedAt || bid.createdAt
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {t('dashboard.message')}: {bid.message}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {t('dashboard.owner')}: {bid.finalProject?.ownerId}
                      </div>
                      <button
                        className="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                        onClick={() => openTimelineModal(bid)}
                        disabled={timelineLoading}
                      >
                        {t('dashboard.manageTimeline')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      case "bids":
        return (
          <>
            {/* Place Bid Modal */}
            <Dialog open={bidModalOpen} onOpenChange={setBidModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.placeABid')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">{t('dashboard.amount')}</Label>
                    <input
                      id="amount"
                      type="number"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value);
                        if (bidAmountError) setBidAmountError(null);
                      }}
                      required
                      min={1}
                    />
                    {bidAmountError && (
                      <div className="text-red-500 text-xs mt-1">
                        {bidAmountError}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message">{t('dashboard.message')}</Label>
                    <textarea
                      id="message"
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={bidMessage}
                      onChange={(e) => {
                        setBidMessage(e.target.value);
                        if (bidMessageError) setBidMessageError(null);
                      }}
                      required
                      rows={3}
                    />
                    {bidMessageError && (
                      <div className="text-red-500 text-xs mt-1">
                        {bidMessageError}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="agreed"
                      type="checkbox"
                      checked={bidAgreed}
                      onChange={(e) => setBidAgreed(e.target.checked)}
                      required
                    />
                    <Label htmlFor="agreed">
                      {t('dashboard.iAgreeToTerms')}
                    </Label>
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      className="px-4 py-2 rounded border"
                      onClick={() => setBidModalOpen(false)}
                      disabled={placingBid}
                    >
                      {t('dashboard.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                      disabled={placingBid}
                    >
                      {placingBid ? "Placing..." : t('dashboard.placeBid')}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="p-6 space-y-12">
              {/* --- Section 1: Manage Your Bids --- */}
              <section>
                <h2 className="text-xl font-bold text-amber-800 mb-4">
                  {t('dashboard.manageYourBids')}
                </h2>
                {bidsLoading ? (
                  <div className="text-amber-600">Loading bids...</div>
                ) : bidsError ? (
                  <div className="text-red-500">{bidsError}</div>
                ) : bids.length === 0 ? (
                  <div className="text-amber-700">No bids found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bids.map((bid) => {
                      // Debug: Log each bid as it is rendered
                      console.log("Rendering bid card:", bid);
                      return (
                        <div
                          key={bid.id}
                          className="bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-bold text-amber-800">
                              {t('dashboard.bid')}: {bid.amount?.toLocaleString()} RWF
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                bid.status === "ACCEPTED"
                                  ? "bg-amber-200 text-amber-800"
                                  : bid.status === "WITHDRAWN"
                                  ? "bg-gray-200 text-gray-500"
                                  : bid.status === "REJECTED"
                                  ? "bg-amber-100 text-amber-400"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {bid.status}
                            </span>
                          </div>
                          <div className="text-amber-700 text-sm mb-2">
                            {bid.message}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {t('dashboard.projectId')}:{" "}
                            <span className="font-mono">
                              {bid.finalProjectId}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {t('dashboard.created')}:{" "}
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2 items-center mt-2">
                            {bid.status === "PENDING" && (
                              <button
                                className="bg-amber-100 text-amber-700 px-3 py-1 rounded hover:bg-amber-200"
                                onClick={() => {
                                  console.log(
                                    "Withdraw button clicked for bid:",
                                    bid
                                  );
                                  withdrawBid(bid.id);
                                }}
                                disabled={withdrawing === bid.id}
                              >
                                {withdrawing === bid.id
                                  ? "Withdrawing..."
                                  : t('dashboard.withdraw')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* --- Section 2: Available Projects to Bid On --- */}
              <section className="mt-12">
                <h2 className="text-xl font-bold text-amber-800 mb-4">
                  {t('dashboard.availableProjectsToBidOn')}
                </h2>
                {projectsLoading ? (
                  <div className="text-amber-600">
                    Loading available projects...
                  </div>
                ) : projectsError ? (
                  <div className="text-red-500">{projectsError}</div>
                ) : availableProjects.length === 0 ? (
                  <div className="text-amber-700">
                    {t('dashboard.noOpenProjectsAvailableForBidding')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableProjects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-gradient-to-br from-white via-amber-50 to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                      >
                        <div className="font-bold text-amber-800 mb-2">
                          {t('dashboard.projectId')}:{" "}
                          <span className="font-mono">{project.id}</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">{t('dashboard.status')}:</span>{" "}
                          {project.status}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.created')}:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.owner')}: {project.owner?.firstName}{" "}
                          {project.owner?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.estCost')}:{" "}
                          {project.choosenEstimation?.estimatedCost?.toLocaleString()}{" "}
                          RWF
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.description')}:{" "}
                          {project.choosenEstimation?.description?.slice(
                            0,
                            120
                          )}
                          {project.choosenEstimation?.description?.length > 120
                            ? "..."
                            : ""}
                        </div>
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                          <button
                            className="w-full sm:w-auto bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                            onClick={() => openBidModal(project)}
                          >
                            {t('dashboard.bid')}
                          </button>
                          <button
                            className="w-full sm:w-auto bg-white text-amber-700 border border-amber-400 px-4 py-2 rounded hover:bg-amber-50"
                            onClick={() => openProjectDetails(project.id)}
                          >
                            {t('dashboard.viewDetails') || 'View Details'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              {/* Details Modal */}
              <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Project Details</DialogTitle>
                  </DialogHeader>
                  {detailsLoading ? (
                    <div>Loading...</div>
                  ) : detailsError ? (
                    <div className="text-red-500">{detailsError}</div>
                  ) : detailsProject ? (
                    <div className="space-y-3 text-sm text-gray-700">
                      <div><span className="font-semibold">ID:</span> {detailsProject.id}</div>
                      <div><span className="font-semibold">Status:</span> {detailsProject.status}</div>
                      <div><span className="font-semibold">Created:</span> {new Date(detailsProject.createdAt).toLocaleDateString()}</div>
                      {detailsProject.summary && (
                        <div>
                          <div className="font-semibold">AI Summary</div>
                          <div className="text-gray-600">{detailsProject.summary}</div>
                        </div>
                      )}
                      {detailsProject.totalEstimatedCost && (
                        <div><span className="font-semibold">Estimated Cost:</span> {new Intl.NumberFormat('en-RW',{style:'currency',currency:detailsProject.currency||'RWF',minimumFractionDigits:0}).format(detailsProject.totalEstimatedCost)}</div>
                      )}
                      {Array.isArray(detailsProject.partialSummaries) && detailsProject.partialSummaries.filter((s:string)=>s?.trim()).length>0 && (
                        <div>
                          <div className="font-semibold mb-1">AI Analysis</div>
                          <ul className="list-disc pl-5 space-y-1">
                            {detailsProject.partialSummaries.filter((s:string)=>s?.trim()).map((s:string,i:number)=>(
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <DialogFooter>
                    <GenericButton onClick={() => setDetailsOpen(false)}>Close</GenericButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        );
      case "negotiation":
        return (
          <div className="p-6">
            <Sheet
              open={negotiationDrawerOpen}
              onOpenChange={setNegotiationDrawerOpen}
            >
              <SheetContent side="right" className="max-w-lg w-full">
                <SheetHeader>
                  <SheetTitle>{t('dashboard.negotiationChat')}</SheetTitle>
                </SheetHeader>
                {negotiationBid && (
                  <NegotiationChat
                    bidId={String(negotiationBid.id)}
                    initialBidData={negotiationBid}
                  />
                )}
                <SheetClose className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">
                  {t('dashboard.close')}
                </SheetClose>
              </SheetContent>
              <div>
                <h2 className="text-xl font-bold text-amber-800 mb-4">
                  {t('dashboard.yourBidsNegotiation')}
                </h2>
                {bidsLoading ? (
                  <div className="text-amber-600">Loading bids...</div>
                ) : bidsError ? (
                  <div className="text-red-500">{bidsError}</div>
                ) : bids.length === 0 ? (
                  <div className="text-amber-700">No bids found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                      >
                        <div className="font-bold text-amber-800 mb-2">
                          {t('dashboard.projectId')}:{" "}
                          <span className="font-mono">
                            {bid.finalProjectId}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">{t('dashboard.bidAmount')}:</span>{" "}
                          {bid.amount?.toLocaleString()} RWF
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {t('dashboard.message')}: {bid.message}
                        </div>
                        <button
                          className="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                          onClick={() => {
                            setNegotiationBid(bid);
                            setNegotiationDrawerOpen(true);
                          }}
                        >
                          {t('dashboard.negotiate')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Sheet>
          </div>
        );
      case "assign":
        // List all accepted bids
        const acceptedBidsAssign = bids.filter(
          (bid) => bid.status === "ACCEPTED"
        );
        return (
          <div className="p-6">
            <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.assignSpecialistWorker')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">{t('dashboard.selectRole')}</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">{t('dashboard.selectRole')}</option>
                      {specialistRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedRole && (
                    <div>
                      <label className="block mb-1 font-medium">{t('dashboard.selectWorker')}</label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedWorkerId}
                        onChange={(e) => setSelectedWorkerId(e.target.value)}
                      >
                        <option value="">{t('dashboard.selectWorker')}</option>
                        {workers
                          .filter(
                            (w) => w.specialist === selectedRole && w.available
                          )
                          .map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name} ({w.email})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <button
                    type="button"
                    className="px-4 py-2 rounded border"
                    onClick={() => setAssignModalOpen(false)}
                  >
                    {t('dashboard.cancel')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                    disabled={!selectedRole || !selectedWorkerId}
                    onClick={handleAssignWorker}
                  >
                    {t('dashboard.assign')}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <h2 className="text-xl font-bold text-amber-800 mb-4">
              {t('dashboard.assignSpecialistsWorkers')}
            </h2>
            {acceptedBidsAssign.length === 0 ? (
              <div className="text-amber-700">
                {t('dashboard.noAcceptedBidsToAssignSpecialists')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedBidsAssign.map((bid) => (
                  <div
                    key={bid.id}
                    className="bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-xl shadow p-5 border border-amber-200"
                  >
                    <div className="font-bold text-amber-800 mb-2">
                      {t('dashboard.projectId')}:{" "}
                      <span className="font-mono">{bid.finalProjectId}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">{t('dashboard.bidAmount')}:</span>{" "}
                      {bid.amount?.toLocaleString()} RWF
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {t('dashboard.message')}: {bid.message}
                    </div>
                    <div className="mt-2">
                      <button
                        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                        onClick={() => openAssignModal(bid)}
                      >
                        {t('dashboard.assignWork')}
                      </button>
                    </div>
                    {/* Show assigned workers for this bid */}
                    {assignedWorkers[bid.id] &&
                      assignedWorkers[bid.id].length > 0 && (
                        <div className="mt-4">
                          <div className="font-semibold text-amber-700 mb-1">
                            {t('dashboard.assignedWorkers')}:
                          </div>
                          <ul className="space-y-1">
                            {assignedWorkers[bid.id].map((aw, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                  {aw.role}
                                </span>
                                <span className="font-medium">
                                  {aw.worker.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 via-white to-amber-100 min-h-screen">
      {/* Summary metrics */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-amber-400 rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-white">{projectsBidOn}</div>
          <div className="text-amber-900 mt-2">{t('dashboard.projectsBidOn')}</div>
        </div>
        <div className="bg-amber-200 rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-amber-900">
            {acceptedCount}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.accepted')}</div>
        </div>
        <div className="bg-amber-100 rounded-xl p-6 shadow text-center">
          <div className="text-3xl font-bold text-amber-900">
            {rejectedCount}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.rejected')}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center border border-amber-100">
          <div className="text-3xl font-bold text-amber-900">
            {withdrawnCount}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.withdrawn')}</div>
        </div>
      </div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-amber-200 rounded-full shadow flex flex-wrap gap-2 p-2">
          <TabsTrigger value="budgetExpense" className="text-amber-700">{t('dashboard.budgetExpense')}</TabsTrigger>
          <TabsTrigger value="milestone" className="text-amber-700">{t('dashboard.milestone')}</TabsTrigger>
          <TabsTrigger value="timeline" className="text-amber-700">{t('dashboard.timeline')}</TabsTrigger>
          <TabsTrigger value="bids" className="text-amber-700">{t('dashboard.bids')}</TabsTrigger>
          <TabsTrigger value="negotiation" className="text-amber-700">{t('dashboard.negotiation')}</TabsTrigger>
          <TabsTrigger value="assign" className="text-amber-700">{t('dashboard.assignSpecialist')}</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Tab content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-amber-100 text-amber-900 dark:text-amber-100">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Page;
