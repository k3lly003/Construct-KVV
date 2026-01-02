"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFloorplanProject } from "@/app/hooks/useFloorplanProject";
import { ProjectDetails } from "@/app/services/floorplanProjectService";
import { useUserStore } from "@/store/userStore";
import {
  Building,
  Calendar,
  DollarSign,
  Clock,
  Users,
  FileText,
  Sparkles,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import Head from "next/head";
import { GenerateBOQModal } from "@/app/(components)/projects/GenerateBOQModal";
import { getBOQ } from "@/app/services/boqService";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { role } = useUserStore();
  const { getProjectById, updateProjectStatus, loading } =
    useFloorplanProject();

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isBOQModalOpen, setIsBOQModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasBOQ, setHasBOQ] = useState(false);
  const [isCheckingBOQ, setIsCheckingBOQ] = useState(true);

  const projectId = params.id as string;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(projectId);
        console.log("🔍 Full project response:", projectData);
        console.log("📊 Analysis data:", {
          partialSummaries: projectData.partialSummaries,
          summary: projectData.summary,
          text: projectData.text,
          estimationSource: projectData.estimationSource,
        });
        setProject(projectData);
      } catch (err) {
        console.error("Failed to load project:", err);
        toast.error("Failed to load project details");
        router.push("/projects");
      }
    };

    const checkBOQ = async () => {
      try {
        const authToken =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        if (authToken) {
          await getBOQ(projectId, authToken);
          setHasBOQ(true);
        }
      } catch (err) {
        // BOQ doesn't exist, which is fine
        setHasBOQ(false);
      } finally {
        setIsCheckingBOQ(false);
      }
    };

    if (projectId) {
      loadProject();
      checkBOQ();
    }
  }, [projectId, getProjectById, router]);

  const handleStatusUpdate = async (
    newStatus: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED"
  ) => {
    if (!project) return;

    setIsUpdatingStatus(true);
    try {
      await updateProjectStatus(project.id, newStatus);
      setProject({ ...project, status: newStatus });
      toast.success(`Project status updated to ${newStatus} successfully!`);
    } catch (err) {
      console.error("Failed to update project status:", err);
      toast.error("Failed to update project status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount?: number, currency = "RWF") => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/projects")}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Filter out empty AI partial summaries so we only render meaningful content
  const nonEmptySummaries =
    project?.partialSummaries?.filter(
      (s) => typeof s === "string" && s.trim().length > 0
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Project Details | Construct KVV</title>
        <meta
          name="description"
          content="View detailed information about your construction project"
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
            className="mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Project #{project.id.slice(-8)}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm">
                  AI Generated
                </Badge>
                <Badge className={`${getStatusColor(project.status)} text-xs sm:text-sm`}>
                  {project.status}
                </Badge>
                <span className="text-xs sm:text-sm text-gray-500">
                  Created{" "}
                  {isClient
                    ? new Date(project.createdAt).toLocaleDateString()
                    : new Date(project.createdAt).toISOString().split("T")[0]}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {role !== "CONTRACTOR" && (
                <Button
                  variant="outline"
                  className="border-amber-400 text-amber-700 hover:bg-amber-50 text-sm sm:text-base"
                  onClick={() => router.push(`/projects/${project.id}/bids`)}
                >
                  View Bids
                </Button>
              )}
              {!isCheckingBOQ && (
                <>
                  {hasBOQ ? (
                    <Button
                      variant="outline"
                      className="border-amber-400 text-amber-700 hover:bg-amber-50 text-sm sm:text-base"
                      onClick={() => router.push(`/projects/${project.id}/boq`)}
                    >
                      <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View BOQ</span>
                      <span className="sm:hidden">BOQ</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-amber-400 text-amber-700 hover:bg-amber-50 text-sm sm:text-base"
                      onClick={() => setIsBOQModalOpen(true)}
                    >
                      <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Generate BOQ</span>
                      <span className="sm:hidden">BOQ</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.summary && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    AI Summary
                  </h4>
                  <p className="text-gray-600">{project.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {project.totalEstimatedCost && (
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Total Cost</h4>
                    <p className="text-base sm:text-lg font-bold text-green-600 break-words">
                      {formatCurrency(
                        project.totalEstimatedCost,
                        project.currency
                      )}
                    </p>
                  </div>
                )}

                {project.estimatedDuration && (
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Duration</h4>
                    <p className="text-base sm:text-lg font-bold text-blue-600">
                      {project.estimatedDuration} months
                    </p>
                  </div>
                )}

                {project.numberOfWorkers && (
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Workers</h4>
                    <p className="text-base sm:text-lg font-bold text-purple-600">
                      {project.numberOfWorkers} people
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          {(project.laborCost ||
            project.materialCost ||
            project.otherExpenses) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {project.laborCost && (
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                        Labor Cost
                      </h4>
                      <p className="text-base sm:text-lg font-bold text-blue-600 break-words">
                        {formatCurrency(project.laborCost, project.currency)}
                      </p>
                    </div>
                  )}
                  {project.materialCost && (
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                        Material Cost
                      </h4>
                      <p className="text-base sm:text-lg font-bold text-green-600 break-words">
                        {formatCurrency(project.materialCost, project.currency)}
                      </p>
                    </div>
                  )}
                  {project.otherExpenses && (
                    <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                        Other Expenses
                      </h4>
                      <p className="text-base sm:text-lg font-bold text-purple-600 break-words">
                        {formatCurrency(
                          project.otherExpenses,
                          project.currency
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* OCR Text */}
          {project.text && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Floorplan Text
                </CardTitle>
                <CardDescription>
                  Text extracted from your floorplan using OCR technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg max-h-64 sm:max-h-96 overflow-y-auto">
                  <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {project.text}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis - only render if we actually have non-empty summaries */}
          {nonEmptySummaries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Analysis Details
                </CardTitle>
                <CardDescription>
                  Detailed analysis generated by our AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {nonEmptySummaries.map((summary, index) => (
                    <div key={index} className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                        Analysis Part {index + 1}
                      </h4>
                      <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">{summary}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Management (Only for project owners) */}
          {role !== "CONTRACTOR" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ToggleLeft className="h-5 w-5" />
                  Project Management
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Control the bidding status of your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                        Current Status
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {project.status === "DRAFT" &&
                          "Project is in draft mode - contractors cannot bid yet"}
                        {project.status === "OPEN" &&
                          "Project is open for contractor bidding"}
                        {project.status === "CLOSED" &&
                          "Bidding is closed - no new bids accepted"}
                        {project.status === "COMPLETED" &&
                          "Project is completed"}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(project.status)} text-xs sm:text-sm shrink-0`}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {project.status === "DRAFT" && (
                      <Button
                        onClick={() => handleStatusUpdate("OPEN")}
                        disabled={isUpdatingStatus}
                        className="bg-green-600 hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto"
                      >
                        {isUpdatingStatus ? "Opening..." : "Open for Bidding"}
                      </Button>
                    )}

                    {project.status === "OPEN" && (
                      <Button
                        onClick={() => handleStatusUpdate("CLOSED")}
                        disabled={isUpdatingStatus}
                        variant="outline"
                        className="text-sm sm:text-base w-full sm:w-auto"
                      >
                        {isUpdatingStatus ? "Closing..." : "Close Bidding"}
                      </Button>
                    )}

                    {project.status === "CLOSED" && (
                      <Button
                        onClick={() => handleStatusUpdate("COMPLETED")}
                        disabled={isUpdatingStatus}
                        className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
                      >
                        {isUpdatingStatus
                          ? "Completing..."
                          : "Mark as Completed"}
                      </Button>
                    )}

                    <Button
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 text-sm sm:text-base w-full sm:w-auto"
                      onClick={() =>
                        router.push(`/projects/${project.id}/management`)
                      }
                    >
                      Open Project Workspace
                    </Button>
                  </div>

                  {project.status === "OPEN" && (
                    <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">
                        ✅ Project is Open for Bidding
                      </h4>
                      <p className="text-green-800 text-xs sm:text-sm">
                        Contractors can now place bids on your project. You'll
                        receive notifications when new bids are submitted.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Generate BOQ Modal */}
      <GenerateBOQModal
        isOpen={isBOQModalOpen}
        onClose={() => {
          setIsBOQModalOpen(false);
          // Refresh BOQ status after generation
          const checkBOQ = async () => {
            try {
              const authToken =
                typeof window !== "undefined"
                  ? localStorage.getItem("authToken")
                  : null;

              if (authToken) {
                await getBOQ(projectId, authToken);
                setHasBOQ(true);
              }
            } catch (err) {
              setHasBOQ(false);
            }
          };
          checkBOQ();
        }}
        projectId={projectId}
      />
    </div>
  );
}
