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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { NegotiationChat } from "@/app/dashboard/(components)/negotiation/NegotiationChat";
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
  const [activeTab, setActiveTab] = useState("bids");
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

  // Debug logging
  console.log("Bids data:", bids);
  console.log("Metrics:", { projectsBidOn, acceptedCount, rejectedCount, withdrawnCount });

  // Refresh function to refetch bids
  const refreshBids = async () => {
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
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch bids: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      
      // Handle different possible data structures
      let bidsData = [];
      if (Array.isArray(data)) {
        bidsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        bidsData = data.data;
      } else if (data.bids && Array.isArray(data.bids)) {
        bidsData = data.bids;
      } else {
        bidsData = [];
      }
      
      setBids(bidsData);
      console.log("Refreshed bids data:", bidsData);
    } catch (e: any) {
      console.error("Error refreshing bids:", e);
      setBidsError(e.message || "Failed to refresh bids");
    } finally {
      setBidsLoading(false);
    }
  };

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

  // --- Negotiation Drawer State ---
  const [negotiationDrawerOpen, setNegotiationDrawerOpen] = useState(false);
  const [negotiationBid, setNegotiationBid] = useState<any | null>(null);

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
        
        console.log("Fetching bids from:", `${API_URL}/api/v1/bids/contractor`);
        const res = await fetch(`${API_URL}/api/v1/bids/contractor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", res.status, errorText);
          throw new Error(`Failed to fetch bids: ${res.status} ${errorText}`);
        }
        
        const data = await res.json();
        console.log("Raw API response:", data);
        
        // Handle different possible data structures
        let bidsData = [];
        if (Array.isArray(data)) {
          bidsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          bidsData = data.data;
        } else if (data.bids && Array.isArray(data.bids)) {
          bidsData = data.bids;
        } else {
          console.warn("Unexpected data structure:", data);
          bidsData = [];
        }
        
        setBids(bidsData);
        console.log("Processed bids data:", bidsData);
        console.log("Bids count:", bidsData.length);
      } catch (e: any) {
        console.error("Error fetching bids:", e);
        setBidsError(e.message || "Failed to load bids");
        setBids([]); // Set empty array on error
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


  // Tab content renderers
  const renderTabContent = () => {
    if (loading) return <div className="text-amber-600 p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;
    switch (activeTab) {
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
                      <div className="text-red-500 text-small mt-1">
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
                      <div className="text-red-500 text-small mt-1">
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
                <h2 className="text-mid font-bold text-amber-800 mb-4">
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
                              className={`text-small px-2 py-1 rounded-full ${
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
                          <div className="text-amber-700 text-small mb-2">
                            {bid.message}
                          </div>
                          <div className="text-small text-gray-500 mb-2">
                            {t('dashboard.projectId')}:{" "}
                            <span className="font-mono">
                              {bid.finalProjectId}
                            </span>
                          </div>
                          <div className="text-small text-gray-500 mb-2">
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
                <h2 className="text-mid font-bold text-amber-800 mb-4">
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
                        <div className="text-small text-gray-700 mb-2">
                          <span className="font-semibold">{t('dashboard.status')}:</span>{" "}
                          {project.status}
                        </div>
                        <div className="text-small text-gray-500 mb-2">
                          {t('dashboard.created')}:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-small text-gray-500 mb-2">
                          {t('dashboard.owner')}: {project.owner?.firstName}{" "}
                          {project.owner?.lastName}
                        </div>
                        <div className="text-small text-gray-500 mb-2">
                          {t('dashboard.estCost')}:{" "}
                          {project.choosenEstimation?.estimatedCost?.toLocaleString()}{" "}
                          RWF
                        </div>
                        <div className="text-small text-gray-500 mb-2">
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
                    <div className="space-y-3 text-small text-gray-700">
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
      case "wonBids":
        // Show only accepted/won bids
        const wonBids = bids.filter((bid) => bid.status === "ACCEPTED");
        return (
          <div className="p-6">
            <h2 className="text-mid font-bold text-amber-800 mb-4">
              {t('dashboard.wonBids')}
            </h2>
            {bidsLoading ? (
              <div className="text-amber-600">Loading bids...</div>
            ) : bidsError ? (
              <div className="text-red-500">{bidsError}</div>
            ) : wonBids.length === 0 ? (
              <div className="text-amber-700">
                {t('dashboard.noWonBidsFound')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wonBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl shadow p-5 border border-green-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-green-800">
                        {t('dashboard.bid')}: {bid.amount?.toLocaleString()} RWF
                      </div>
                      <span className="text-small px-2 py-1 rounded-full bg-green-200 text-green-800">
                        {t('dashboard.accepted') || 'ACCEPTED'}
                      </span>
                    </div>
                    <div className="text-green-700 text-small mb-2">
                      {bid.message}
                    </div>
                    <div className="text-small text-gray-500 mb-2">
                      {t('dashboard.projectId')}:{" "}
                      <span className="font-mono">
                        {bid.finalProjectId}
                      </span>
                    </div>
                    <div className="text-small text-gray-500 mb-2">
                      {t('dashboard.acceptedAt')}:{" "}
                      {new Date(bid.updatedAt || bid.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-small text-gray-500 mb-2">
                      {t('dashboard.owner')}: {bid.finalProject?.ownerId}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-small"
                        onClick={() => {
                          setNegotiationBid(bid);
                          setNegotiationDrawerOpen(true);
                        }}
                      >
                        {t('dashboard.negotiate')}
                      </button>
                      <button
                        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 text-small"
                        onClick={() => openProjectDetails(bid.finalProjectId)}
                      >
                        {t('dashboard.viewProject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                <h2 className="text-mid font-bold text-amber-800 mb-4">
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
                        <div className="text-small text-gray-700 mb-2">
                          <span className="font-semibold">{t('dashboard.bidAmount')}:</span>{" "}
                          {bid.amount?.toLocaleString()} RWF
                        </div>
                        <div className="text-small text-gray-500 mb-2">
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
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 via-white to-amber-100 min-h-screen">
      {/* Summary metrics */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-mid font-bold text-amber-800">Bid Statistics</h2>
          <button
            onClick={refreshBids}
            disabled={bidsLoading}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
          >
            {bidsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
        {bidsError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error loading bids:</strong> {bidsError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-amber-400 rounded-xl p-6 shadow text-center">
          <div className="text-title font-bold text-white">
            {bidsLoading ? "..." : projectsBidOn}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.projectsBidOn')}</div>
        </div>
        <div className="bg-amber-200 rounded-xl p-6 shadow text-center">
          <div className="text-title font-bold text-amber-900">
            {bidsLoading ? "..." : acceptedCount}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.accepted')}</div>
        </div>
        <div className="bg-amber-100 rounded-xl p-6 shadow text-center">
          <div className="text-title font-bold text-amber-900">
            {bidsLoading ? "..." : rejectedCount}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.rejected')}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center border border-amber-100">
          <div className="text-title font-bold text-amber-900">
            {bidsLoading ? "..." : withdrawnCount}
          </div>
          <div className="text-amber-900 mt-2">{t('dashboard.withdrawn')}</div>
        </div>
        </div>
      </div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-amber-200 rounded-full shadow flex flex-wrap gap-2 p-2">
          <TabsTrigger value="bids" className="text-amber-700">{t('dashboard.bids')}</TabsTrigger>
          <TabsTrigger value="wonBids" className="text-amber-700">{t('dashboard.wonBids')}</TabsTrigger>
          <TabsTrigger value="negotiation" className="text-amber-700">{t('dashboard.negotiation')}</TabsTrigger>
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
