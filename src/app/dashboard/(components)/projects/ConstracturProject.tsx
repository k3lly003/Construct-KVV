"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@/app/services/ContractorService";
import {
  getContractorProjects,
  getMilestoneByProject,
  upsertMilestone,
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

  const [budgetItem, setBudgetItem] = useState("");
  const [budgetCost, setBudgetCost] = useState("");
  const [milestonesByProject, setMilestonesByProject] = useState<
    Record<string, Milestone | null>
  >({});

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
        }
        setMilestonesByProject(entries);
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
    setBudgetItem("");
    setBudgetCost("");
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
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    Your Closed Projects
                  </h1>
                  <p className="text-muted-foreground text-sm">
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
            <p className="text-sm text-muted-foreground">Please wait.</p>
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
            <p className="text-sm text-muted-foreground">
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
            <p className="text-sm text-destructive">{error}</p>
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
                        <CardTitle className="text-base sm:text-lg">
                          Project Owner
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {project.owner.firstName} {project.owner.lastName}
                        </CardDescription>
                      </div>
                      <div className="rounded-md px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        CLOSED
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground col-span-1">
                          Email
                        </span>
                        <span className="col-span-2 break-all">
                          {project.owner.email}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground col-span-1">
                          Phone
                        </span>
                        <span className="col-span-2">
                          {project.owner.phone}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="md:w-[60%] pt-4 md:pt-6">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground col-span-1">
                            Agreed amount
                          </span>
                          <span className="col-span-2 font-medium">
                            {acceptedBid
                              ? `${acceptedBid.amount} ${project.currency}`
                              : "—"}
                          </span>
                        </div>
                        {milestonesByProject[project.id] && (
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground col-span-1">
                              Milestone
                            </span>
                            <span className="col-span-2">
                              F: {milestonesByProject[project.id]?.foundation}%
                              · R: {milestonesByProject[project.id]?.roofing}% ·
                              Fi: {milestonesByProject[project.id]?.finishing}%
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground col-span-1">
                            Duration
                          </span>
                          <span className="col-span-2">
                            {project.estimatedDuration} days
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground col-span-1">
                            Workers
                          </span>
                          <span className="col-span-2">
                            {project.numberOfWorkers}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground col-span-1">
                            Labor cost
                          </span>
                          <span className="col-span-2">
                            {project.laborCost} {project.currency}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground col-span-1">
                            Material cost
                          </span>
                          <span className="col-span-2">
                            {project.materialCost} {project.currency}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground col-span-1">
                            Cost / sq ft
                          </span>
                          <span className="col-span-2">
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
                    <div className="grid gap-2">
                      <Label htmlFor="t-name">Entry name</Label>
                      <Input
                        id="t-name"
                        value={timelineName}
                        onChange={(e) => setTimelineName(e.target.value)}
                        placeholder="Framing phase"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="t-due">Due date</Label>
                      <Input
                        id="t-due"
                        type="date"
                        value={timelineDue}
                        onChange={(e) => setTimelineDue(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {activeSection === "Budget" && (
                  <div className="space-y-4 mt-2">
                    <div className="grid gap-2">
                      <Label htmlFor="b-item">Item</Label>
                      <Input
                        id="b-item"
                        value={budgetItem}
                        onChange={(e) => setBudgetItem(e.target.value)}
                        placeholder="Concrete mix"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="b-cost">Cost</Label>
                      <Input
                        id="b-cost"
                        type="number"
                        value={budgetCost}
                        onChange={(e) => setBudgetCost(e.target.value)}
                        placeholder="2500"
                      />
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
