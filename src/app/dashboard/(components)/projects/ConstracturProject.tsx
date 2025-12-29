"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  ContractorProject,
  Milestone,
  Timeline,
} from "@/app/services/ContractorService";
import {
  getContractorProjects,
  getMilestoneByProject,
  upsertMilestone,
  getTimelineByProject,
  upsertTimeline,
  getBudgetByProject,
  createBudgetExpense,
} from "@/app/services/ContractorService";
import { toast } from "sonner";

type SectionType = "Milestone" | "Timeline" | "Budget";

export default function ContractorProjects() {
  const [projects, setProjects] = useState<ContractorProject[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeProject, setActiveProject] = useState<ContractorProject | null>(
    null
  );
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form fields (simple local state per section)
  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneDeadline, setMilestoneDeadline] = useState("");
  const [foundation, setFoundation] = useState("");
  const [roofing, setRoofing] = useState("");
  const [finishing, setFinishing] = useState("");

  const [timelineName, setTimelineName] = useState("");
  const [timelineDue, setTimelineDue] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [endedAt, setEndedAt] = useState("");

  const [budgetItem, setBudgetItem] = useState("");
  const [budgetCost, setBudgetCost] = useState("");
  const [budgetStage, setBudgetStage] = useState<
    "Foundation" | "Roofing" | "Finishing" | ""
  >("");
  const [milestonesByProject, setMilestonesByProject] = useState<
    Record<string, Milestone | null>
  >({});
  const [timelineByProject, setTimelineByProject] = useState<
    Record<string, Timeline | null>
  >({});
  const [budgetByProject, setBudgetByProject] = useState<
    Record<
      string,
      {
        expenses: {
          id: string;
          description: string;
          stage: "Foundation" | "Roofing" | "Finishing";
          createdAt: string;
          finalProjectId: string;
          expenseAmount: number;
        }[];
        totalBudget: number;
        totalSpent: number;
        remaining: number;
      } | null
    >
  >({});

  const formatDateOnly = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      const datePart = iso.includes("T") ? iso.split("T")[0] : iso;
      return datePart;
    }
    return d.toLocaleDateString();
  };

  const contractorId = useMemo(() => {
    try {
      const userRaw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!userRaw) return null;
      const user = JSON.parse(userRaw || "null");
      const id = user?.id ?? null;
      console.log("[ContractorProjects] contractorId derived from user", {
        id,
        user,
      });
      return id;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken") || localStorage.getItem("token")
            : null;
        const maskedToken = token
          ? `${token.slice(0, 6)}...${token.slice(-4)}`
          : "<none>";
        console.log("[ContractorProjects] fetchProjects: INIT", {
          contractorId,
          tokenMasked: maskedToken,
        });
        if (!token || !contractorId) {
          console.warn("[ContractorProjects] Missing token or contractorId", {
            hasToken: !!token,
            contractorId,
          });
          setProjects([]);
          setIsLoading(false);
          return;
        }

        const data = await getContractorProjects(token, contractorId);
        console.log("[ContractorProjects] fetchProjects: DATA", {
          count: data?.length ?? 0,
          sample: data?.[0],
        });
        setProjects(data);
        const entries: Record<string, Milestone | null> = {};
        const timelines: Record<string, Timeline | null> = {};
        const budgets: typeof budgetByProject = {};
        for (const p of data) {
          try {
            const m = await getMilestoneByProject(token, p.id);
            entries[p.id] = m;
          } catch (e) {
            console.warn(
              "[ContractorProjects] preload milestone failed",
              p.id,
              e
            );
            entries[p.id] = null;
          }
          try {
            const t = await getTimelineByProject(token, p.id);
            timelines[p.id] = t;
          } catch (e) {
            console.warn(
              "[ContractorProjects] preload timeline failed",
              p.id,
              e
            );
            timelines[p.id] = null;
          }
          try {
            const b = await getBudgetByProject(token, p.id);
            budgets[p.id] = b;
          } catch (e) {
            console.warn("[ContractorProjects] preload budget failed", p.id, e);
            budgets[p.id] = null;
          }
        }
        setMilestonesByProject(entries);
        setTimelineByProject(timelines);
        setBudgetByProject(budgets);
      } catch (err) {
        console.error("[ContractorProjects] fetchProjects: ERROR", err);
        setError("Failed to load projects.");
        setProjects([]);
      } finally {
        console.log("[ContractorProjects] fetchProjects: DONE");
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [contractorId]);

  const openModal = (project: ContractorProject, section: SectionType) => {
    console.log("[ContractorProjects] openModal", {
      projectId: project.id,
      section,
    });
    setActiveProject(project);
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("[ContractorProjects] closeModal");
    setIsModalOpen(false);
    setActiveProject(null);
    setActiveSection(null);
    // reset fields
    setMilestoneName("");
    setMilestoneDescription("");
    setMilestoneDeadline("");
    setFoundation("");
    setRoofing("");
    setFinishing("");
    setTimelineName("");
    setTimelineDue("");
    setStartedAt("");
    setEndedAt("");
    setBudgetItem("");
    setBudgetCost("");
    setBudgetStage("");
  };

  const handleSave = async () => {
    console.log("[ContractorProjects] handleSave:init", {
      projectId: activeProject?.id,
      section: activeSection,
      milestone: { milestoneName, milestoneDescription, milestoneDeadline },
      milestoneValues: { foundation, roofing, finishing },
      timeline: { timelineName, timelineDue },
      budget: { budgetItem, budgetCost },
    });
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken") || localStorage.getItem("token")
          : null;
      if (!token) {
        toast.error("You are not authenticated");
        return;
      }

      if (activeSection === "Milestone" && activeProject) {
        const payload = {
          foundation: Number(foundation || 0),
          roofing: Number(roofing || 0),
          finishing: Number(finishing || 0),
        };
        console.log("[ContractorProjects] milestone:upsert", {
          finalProjectId: activeProject.id,
          payload,
        });
        const saved = await upsertMilestone(token, activeProject.id, payload);
        setMilestonesByProject((prev) => ({
          ...prev,
          [activeProject.id]: saved,
        }));
        toast.success("Milestone saved successfully");
      }

      if (activeSection === "Timeline" && activeProject) {
        const payload = {
          startedAt: startedAt || new Date().toISOString(),
          endedAt: endedAt || new Date().toISOString(),
        };
        console.log("[ContractorProjects] timeline:upsert", {
          finalProjectId: activeProject.id,
          payload,
        });
        const saved = await upsertTimeline(token, activeProject.id, payload);
        setTimelineByProject((prev) => ({
          ...prev,
          [activeProject.id]: saved,
        }));
        toast.success("Timeline saved successfully");
      }

      if (activeSection === "Budget" && activeProject) {
        const description = budgetItem.trim();
        const expenseAmount = Number(budgetCost || 0);
        const stage = budgetStage as "Foundation" | "Roofing" | "Finishing";
        if (!description || !expenseAmount || !stage) {
          toast.error("Please provide description, stage and amount");
          return;
        }
        const saved = await createBudgetExpense(token, activeProject.id, {
          description,
          stage,
          expenseAmount,
        });
        console.log("[ContractorProjects] budget:created", saved);
        const refreshed = await getBudgetByProject(token, activeProject.id);
        setBudgetByProject((prev) => ({
          ...prev,
          [activeProject.id]: refreshed,
        }));
        toast.success("Expense added successfully");
      }
    } catch (e) {
      console.error("[ContractorProjects] handleSave:error", e);
      toast.error("Failed to save");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-[1px]">
            <div className="bg-card p-6 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-2 rounded-full bg-amber-500" />
                <div>
                  <h1 className="text-mid sm:text-mid font-semibold">
                    Your Closed Projects
                  </h1>
                  <p className="text-muted-foreground text-small">
                    Track agreed budgets, timelines, and milestones for projects
                    you’ve won.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Fetching your closed projects…</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-small text-muted-foreground">Please wait.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && (projects?.length ?? 0) === 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>No projects</CardTitle>
            <CardDescription>Nothing to manage yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-small text-muted-foreground">
              No projects found Yet .
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Something went wrong</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-small text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && (projects?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {projects!.map((project) => {
            const acceptedBid = project.bids?.find(
              (b) => b.contractorId === contractorId && b.status === "ACCEPTED"
            );
            // Debug why agreed amount may not show
            try {
              console.log("[ContractorProjects] Bid debug", {
                projectId: project.id,
                contractorId,
                bidsCount: Array.isArray(project.bids)
                  ? project.bids.length
                  : 0,
                bids: project.bids,
                acceptedBid,
                currency: project.currency,
              });
              if (acceptedBid) {
                console.log("[ContractorProjects] Agreed amount", {
                  projectId: project.id,
                  contractorId,
                  amount: acceptedBid.amount,
                  currency: project.currency,
                });
              }
              if (!acceptedBid) {
                const contractorBids = (project.bids || []).filter(
                  (b) => b.contractorId === contractorId
                );
                console.log(
                  "[ContractorProjects] No accepted bid found for contractor on this project",
                  {
                    projectId: project.id,
                    contractorId,
                    contractorBids,
                  }
                );
              }
            } catch {}

            const timeline = timelineByProject[project.id];
            let progressPercent: number | null = null;
            if (timeline?.startedAt && timeline?.endedAt) {
              const startMs = new Date(timeline.startedAt).getTime();
              const endMs = new Date(timeline.endedAt).getTime();
              const nowMs = Date.now();
              if (endMs > startMs) {
                const pct = ((nowMs - startMs) / (endMs - startMs)) * 100;
                progressPercent = Math.max(
                  0,
                  Math.min(100, Number(pct.toFixed(2)))
                );
              }
            }

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -2 }}
              >
                <Card className="flex flex-col md:flex-row md:items-stretch">
                  <CardHeader className="md:w-[40%] pb-4 md:pb-6 border-b md:border-b-0 md:border-r">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-mid sm:text-mid">
                          Project Owner
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-base">
                          {project.owner.firstName} {project.owner.lastName}
                        </CardDescription>
                      </div>
                      <div className="rounded-md px-2 py-1 text-small font-medium bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        CLOSED
                      </div>
                    </div>
                    <div className="mt-1 space-y-2 text-base">
                      <div className="grid grid-cols-3 gap-3">
                        <span className="text-muted-foreground col-span-1">
                          Email
                        </span>
                        <span className="col-span-2 break-all">
                          {project.owner.email}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <span className="text-muted-foreground col-span-1">
                          Phone
                        </span>
                        <span className="col-span-2">
                          {project.owner.phone}
                        </span>
                      </div>
                      {budgetByProject[project.id] && (
                        <div className="mt-4">
                          <div className="rounded-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-[1px] rounded-lg">
                              <div className="bg-card rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-small font-medium">
                                    Budget
                                  </span>
                                  {(() => {
                                    const b = budgetByProject[project.id]!;
                                    const isLoss = b.totalSpent > b.totalBudget;
                                    return (
                                      <span
                                        className={`text-small font-semibold ${
                                          isLoss
                                            ? "text-amber-800"
                                            : "text-amber-700"
                                        }`}
                                      >
                                        {isLoss ? "Over budget" : "On track"}
                                      </span>
                                    );
                                  })()}
                                </div>
                                <div className="mt-3 h-32">
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <PieChart>
                                      <Pie
                                        dataKey="value"
                                        data={(() => {
                                          const b =
                                            budgetByProject[project.id]!;
                                          return [
                                            {
                                              name: "Spent",
                                              value: b.totalSpent,
                                            },
                                            {
                                              name: "Remaining",
                                              value: Math.max(0, b.remaining),
                                            },
                                          ];
                                        })()}
                                        innerRadius={30}
                                        outerRadius={50}
                                        paddingAngle={2}
                                        stroke="#fff"
                                      >
                                        <Cell fill="#F59E0B" />
                                        <Cell fill="#FCD34D" />
                                      </Pie>
                                      <Legend
                                        verticalAlign="bottom"
                                        height={24}
                                      />
                                      <Tooltip
                                        formatter={(v: any) =>
                                          `${Number(v).toLocaleString()}`
                                        }
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className="mt-3 space-y-2 max-h-28 overflow-auto pr-1">
                                  {budgetByProject[project.id]!.expenses.slice()
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime()
                                    )
                                    .slice(0, 4)
                                    .map((e) => (
                                      <div
                                        key={e.id}
                                        className="flex items-center justify-between text-small"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                                          <span className="font-medium">
                                            {e.description}
                                          </span>
                                          <span className="text-muted-foreground">
                                            ({e.stage})
                                          </span>
                                          <span className="hidden sm:inline">
                                            •
                                          </span>
                                          <span className="text-muted-foreground">
                                            {formatDateOnly(e.createdAt)}
                                          </span>
                                        </div>
                                        <span className="font-semibold">
                                          {e.expenseAmount.toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-small">
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">
                                      Total
                                    </span>
                                    <span className="font-semibold">
                                      {budgetByProject[
                                        project.id
                                      ]!.totalBudget.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">
                                      Spent
                                    </span>
                                    <span className="font-semibold">
                                      {budgetByProject[
                                        project.id
                                      ]!.totalSpent.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">
                                      Remaining
                                    </span>
                                    <span className="font-semibold">
                                      {budgetByProject[
                                        project.id
                                      ]!.remaining.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="md:w-[60%] pt-4 md:pt-6">
                    <div className="grid md:grid-cols-2 gap-5 text-base">
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <span className="text-muted-foreground col-span-1">
                            Agreed amount
                          </span>
                          <span className="col-span-2 font-semibold">
                            {acceptedBid
                              ? `${acceptedBid.amount} ${project.currency}`
                              : "—"}
                          </span>
                        </div>
                        {/* milestone visuals moved to a dedicated card below */}
                        <div className="grid grid-cols-3 gap-3">
                          <span className="text-muted-foreground col-span-1">
                            Duration
                          </span>
                          <span className="col-span-2">
                            {project.estimatedDuration} days
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <span className="text-muted-foreground col-span-1">
                            Workers
                          </span>
                          <span className="col-span-2">
                            {project.numberOfWorkers}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <span className="text-muted-foreground col-span-1">
                            Labor cost
                          </span>
                          <span className="col-span-2 font-medium">
                            {project.laborCost} {project.currency}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <span className="text-muted-foreground col-span-1">
                            Material cost
                          </span>
                          <span className="col-span-2 font-medium">
                            {project.materialCost} {project.currency}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <span className="text-muted-foreground col-span-1">
                            Cost / sq ft
                          </span>
                          <span className="col-span-2 font-medium">
                            {project.costPerSquareFoot} {project.currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {project.fileUrl && (
                        <a
                          href={project.fileUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex"
                        >
                          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700">
                            View File
                          </Button>
                        </a>
                      )}
                      <div className="ml-auto w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                          onClick={() => openModal(project, "Milestone")}
                        >
                          🧱 Manage Milestone
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                          onClick={() => openModal(project, "Timeline")}
                        >
                          🕒 Timeline
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                          onClick={() => openModal(project, "Budget")}
                        >
                          💰 Budget
                        </Button>
                      </div>
                    </div>

                    {milestonesByProject[project.id] && (
                      <div className="mt-5">
                        <Card className="border-amber-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-small">
                              Milestones
                            </CardTitle>
                            <CardDescription>
                              Current phase distribution
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="w-20 text-small text-muted-foreground">
                                Foundation
                              </span>
                              <div className="h-2 w-full rounded bg-amber-100 overflow-hidden">
                                <motion.div
                                  className="h-2 rounded bg-gradient-to-r from-amber-500 to-amber-600"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      milestonesByProject[project.id]
                                        ?.foundation ?? 0
                                    }%`,
                                  }}
                                  transition={{ duration: 0.4 }}
                                />
                              </div>
                              <span className="w-10 text-right text-small">
                                {milestonesByProject[project.id]?.foundation}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-20 text-small text-muted-foreground">
                                Roofing
                              </span>
                              <div className="h-2 w-full rounded bg-amber-100 overflow-hidden">
                                <motion.div
                                  className="h-2 rounded bg-gradient-to-r from-amber-500 to-amber-600"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      milestonesByProject[project.id]
                                        ?.roofing ?? 0
                                    }%`,
                                  }}
                                  transition={{ duration: 0.4 }}
                                />
                              </div>
                              <span className="w-10 text-right text-small">
                                {milestonesByProject[project.id]?.roofing}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-20 text-small text-muted-foreground">
                                Finishing
                              </span>
                              <div className="h-2 w-full rounded bg-amber-100 overflow-hidden">
                                <motion.div
                                  className="h-2 rounded bg-gradient-to-r from-amber-500 to-amber-600"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      milestonesByProject[project.id]
                                        ?.finishing ?? 0
                                    }%`,
                                  }}
                                  transition={{ duration: 0.4 }}
                                />
                              </div>
                              <span className="w-10 text-right text-small">
                                {milestonesByProject[project.id]?.finishing}%
                              </span>
                            </div>
                            <div className="flex items-center justify-end pt-1">
                              {(() => {
                                const f =
                                  milestonesByProject[project.id]?.foundation ||
                                  0;
                                const r =
                                  milestonesByProject[project.id]?.roofing || 0;
                                const fi =
                                  milestonesByProject[project.id]?.finishing ||
                                  0;
                                const avg = Number(
                                  ((f + r + fi) / 3).toFixed(2)
                                );
                                return (
                                  <span className="text-small sm:text-base font-semibold text-amber-700">
                                    Total progress: {avg}%
                                  </span>
                                );
                              })()}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {timeline && (
                      <div className="mt-5">
                        <div className="rounded-xl p-[1px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                          <Card className="border-amber-100 rounded-[11px]">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-small">
                                  Timeline
                                </CardTitle>
                                {progressPercent !== null && (
                                  <span className="text-small font-medium text-amber-700 dark:text-amber-300">
                                    {progressPercent}%
                                  </span>
                                )}
                              </div>
                              <CardDescription>
                                Project schedule window
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-small sm:text-small text-muted-foreground">
                              <div className="flex flex-col gap-3">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center justify-between text-foreground"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                    Start: {formatDateOnly(timeline.startedAt)}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-600" />
                                    End: {formatDateOnly(timeline.endedAt)}
                                  </span>
                                </motion.div>
                                {progressPercent !== null && (
                                  <div className="h-2 w-full rounded bg-amber-100 overflow-hidden">
                                    <motion.div
                                      className="h-2 rounded bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progressPercent}%` }}
                                      transition={{ duration: 0.6 }}
                                    />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                    {!timelineByProject[project.id] && (
                      <div className="mt-5">
                        <Card className="border-dashed">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-small">Timeline</CardTitle>
                            <CardDescription>
                              No timeline defined yet. Use “Timeline” to set
                              start and end.
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
                    )}
                    {!milestonesByProject[project.id] && (
                      <div className="mt-5">
                        <Card className="border-dashed">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-small">
                              Milestones
                            </CardTitle>
                            <CardDescription>
                              No milestones yet for this project. Use “Manage
                              Milestone” to add progress.
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => (!open ? closeModal() : setIsModalOpen(true))}
      >
        <DialogContent className="sm:max-w-lg">
          <AnimatePresence initial={false} mode="wait">
            {isModalOpen && (
              <motion.div
                key={`${activeProject?.id}-${activeSection}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                <DialogHeader>
                  <DialogTitle>
                    {activeSection ? `Manage ${activeSection}` : "Manage"}
                  </DialogTitle>
                </DialogHeader>

                {activeSection === "Milestone" && (
                  <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="m-foundation">Foundation (%)</Label>
                        <Input
                          id="m-foundation"
                          type="number"
                          value={foundation}
                          onChange={(e) => setFoundation(e.target.value)}
                          placeholder="50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="m-roofing">Roofing (%)</Label>
                        <Input
                          id="m-roofing"
                          type="number"
                          value={roofing}
                          onChange={(e) => setRoofing(e.target.value)}
                          placeholder="20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="m-finishing">Finishing (%)</Label>
                        <Input
                          id="m-finishing"
                          type="number"
                          value={finishing}
                          onChange={(e) => setFinishing(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "Timeline" && (
                  <div className="space-y-4 mt-2">
                    <div className="rounded-lg p-[1px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                      <div className="rounded-[9px] bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/70 p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label htmlFor="t-start">Start</Label>
                            <Input
                              id="t-start"
                              className="focus-visible:ring-amber-500"
                              type="datetime-local"
                              value={startedAt}
                              onChange={(e) => setStartedAt(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="t-end">End</Label>
                            <Input
                              id="t-end"
                              className="focus-visible:ring-amber-500"
                              type="datetime-local"
                              value={endedAt}
                              onChange={(e) => setEndedAt(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "Budget" && (
                  <div className="space-y-4 mt-2">
                    <div className="rounded-lg p-[1px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                      <div className="rounded-[9px] bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/70 p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="b-desc">Description</Label>
                            <Input
                              id="b-desc"
                              value={budgetItem}
                              onChange={(e) => setBudgetItem(e.target.value)}
                              placeholder="Buying all needed materials"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="b-amount">Amount</Label>
                            <Input
                              id="b-amount"
                              type="number"
                              value={budgetCost}
                              onChange={(e) => setBudgetCost(e.target.value)}
                              placeholder="10000000"
                            />
                          </div>
                          <div className="grid gap-2 sm:col-span-1">
                            <Label htmlFor="b-stage">Stage</Label>
                            <select
                              id="b-stage"
                              className="h-10 rounded-md border bg-background px-3 text-small focus:outline-none focus:ring-2 focus:ring-amber-500"
                              value={budgetStage}
                              onChange={(e) =>
                                setBudgetStage(e.target.value as any)
                              }
                            >
                              <option value="">Select stage</option>
                              <option value="Foundation">Foundation</option>
                              <option value="Roofing">Roofing</option>
                              <option value="Finishing">Finishing</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
