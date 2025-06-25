"use client";

import React from "react";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useProject, useSafeFormContext } from "@/app/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenericButton } from "@/components/ui/generic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  projectService,
  ProjectStatus,
  convertFormDataToProjectUpdate,
  ProjectUpdateData,
} from "@/app/services/projectServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NegotiationChat } from "@/app/dashboard/(components)/negotiation/NegotiationChat";
import { any } from "zod";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

// Add BidStatus enum
export enum BidStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
  COUNTERED = "COUNTERED",
}

function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = React.use(params);
  const { project, isLoading, error, refetch } = useProject(resolvedParams.id);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = React.useState(false);

  // Use safe form context
  const { formData } = useSafeFormContext();

  // State for update form
  const [updateFormData, setUpdateFormData] = React.useState<ProjectUpdateData>(
    {
      roomsCount: 0,
      bathroomsCount: 0,
      kitchensCount: 1,
      conversationRoomsCount: 0,
      extras: [],
      description: "",
      estimatedCost: 0,
    }
  );

  // Initialize form data when project loads
  React.useEffect(() => {
    if (project) {
      setUpdateFormData({
        roomsCount: project.choosenEstimation.roomsCount,
        bathroomsCount: project.choosenEstimation.bathroomsCount,
        kitchensCount: project.choosenEstimation.kitchensCount,
        conversationRoomsCount:
          project.choosenEstimation.conversationRoomsCount,
        extras: project.choosenEstimation.extras,
        description: project.choosenEstimation.description,
        estimatedCost: project.choosenEstimation.estimatedCost,
      });
    }
  }, [project]);

  console.log("🏠 Project Page Rendered for ID:", resolvedParams.id);
  console.log("📊 Project Data:", project);
  console.log("🔄 Loading:", isLoading);
  console.log("❌ Error:", error);
  console.log("📝 Update Form Data:", updateFormData);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!project) return;

    setIsUpdatingStatus(true);
    try {
      // Use the direct PATCH endpoint as requested
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please login first.");
        setIsUpdatingStatus(false);
        return;
      }
      await fetch(
        `http://localhost:3000/api/v1/final-project/${project.id}/status`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      // Refetch the project data to get the updated status
      await refetch();
      toast.success(`Project status updated to ${newStatus} successfully! 🎉`);
    } catch (error) {
      toast.error("Failed to update project status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateProject = async () => {
    console.log("🔘 STEP 1: Update button clicked");

    if (!project) {
      console.log("❌ STEP 1 FAILED: No project data available");
      return;
    }
    console.log("✅ STEP 1 PASSED: Project data available");

    console.log("🔘 STEP 2: Setting loading state");
    setIsUpdatingProject(true);
    console.log("✅ STEP 2 PASSED: Loading state set to true");

    try {
      console.log("🔘 STEP 3: Starting project update process");
      console.log("🆔 Project ID being sent:", project.id);
      console.log("🆔 Project ID type:", typeof project.id);
      console.log("🆔 Project ID length:", project.id.length);
      console.log("🆔 Full project object:", project);
      console.log("📝 Form data being used:", updateFormData);
      console.log("✅ STEP 3 PASSED: Logged all project and form data");

      console.log("🔘 STEP 4: Using update form data directly");
      // Use update form data directly since it's already in the correct format
      const projectUpdateData = updateFormData;
      console.log("✅ STEP 4 PASSED: Update form data ready");
      console.log("📝 Project update data:", projectUpdateData);

      console.log("🔘 STEP 5: Calling projectService.updateProject");
      console.log("🆔 Project ID for API call:", project.id);

      // Update the project
      await projectService.updateProject(project.id, projectUpdateData);
      console.log(
        "✅ STEP 5 PASSED: projectService.updateProject completed successfully"
      );

      console.log("🔘 STEP 6: Refetching project data");
      // Refetch the project data to get the updated information
      await refetch();
      console.log("✅ STEP 6 PASSED: Project data refetched successfully");

      console.log("🔘 STEP 7: Showing success message");
      console.log("✅ Project updated successfully");
      toast.success("Project updated successfully! 🎉", {
        style: {
          background: "white",
          color: "#92400e",
          border: "1px solid #f59e0b",
        },
      });
      console.log("✅ STEP 7 PASSED: Success message shown");
    } catch (error: any) {
      console.log("❌ ERROR CAUGHT: Update process failed");
      console.error("❌ Error updating project:", error);
      console.error("❌ Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      console.error("❌ Project ID that failed:", project.id);
      console.log("🔘 STEP ERROR: Showing error toast");
      toast.error("Failed to update project. Please try again.", {
        style: {
          background: "white",
          color: "#dc2626",
          border: "1px solid #ef4444",
        },
      });
      console.log("✅ STEP ERROR PASSED: Error toast shown");
    } finally {
      console.log("🔘 STEP 8: Cleaning up loading state");
      setIsUpdatingProject(false);
      console.log("✅ STEP 8 PASSED: Loading state set to false");
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "OPEN":
        return "bg-green-100 text-green-800 border-green-300";
      case "CLOSED":
        return "bg-red-100 text-red-800 border-red-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case "DRAFT":
        return "📝";
      case "OPEN":
        return "🔓";
      case "CLOSED":
        return "🔒";
      case "COMPLETED":
        return "✅";
      default:
        return "📋";
    }
  };

  if (isLoading) {
    return (
      <>
        <DefaultPageBanner
          title="Project Details & Bidding"
          backgroundImage="/building.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <span className="text-amber-800">Loading project details...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <DefaultPageBanner
          title="Project Details & Bidding"
          backgroundImage="/building.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Project Not Found
            </h3>
            <p className="text-amber-800 mb-6">
              The project you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link href="/projects">
              <GenericButton
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
              >
                ← Back to Projects
              </GenericButton>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DefaultPageBanner
        title="Project Details & Bidding"
        backgroundImage="/building.jpg"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/projects">
            <GenericButton
              variant="outline"
              size="sm"
              className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
            >
              ← Back to Projects
            </GenericButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Project Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-amber-900 mb-2">
                    House Project
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-sm ${getStatusColor(project.status)}`}
                    >
                      {getStatusIcon(project.status)} {project.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-700">Project ID</p>
                  <p className="text-xs text-amber-600 font-mono">
                    {project.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    Project Description
                  </h3>
                  <p className="text-amber-800 leading-relaxed">
                    {project.choosenEstimation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🛏️</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.roomsCount}
                    </div>
                    <div className="text-xs text-amber-700">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🚿</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.bathroomsCount}
                    </div>
                    <div className="text-xs text-amber-700">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🍳</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.kitchensCount}
                    </div>
                    <div className="text-xs text-amber-700">Kitchens</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.conversationRoomsCount}
                    </div>
                    <div className="text-xs text-amber-700">Living Rooms</div>
                  </div>
                </div>

                {project.choosenEstimation.extras.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">
                      Additional Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.choosenEstimation.extras.map((extra, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm border-amber-500 text-amber-700 bg-white"
                        >
                          {extra.name.replace(/_/g, " ")} ({extra.detail.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bids Section */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Bids & Offers
              </h3>
              {project.bids.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-amber-800">
                    No bids have been submitted yet.
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    Suppliers will be able to submit bids once the project is
                    published.
                  </p>

                  {/* Call to Action for Professionals */}
                  <div className="mt-6 p-4 bg-amber-500 rounded-lg border border-amber-600">
                    <h4 className="font-semibold text-white mb-2">
                      Ready to Submit Your Bid?
                    </h4>
                    <p className="text-white/90 text-sm mb-3">
                      Are you a qualified professional? Submit your competitive
                      bid for this project.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🏗️ Architects
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🔧 Plumbers
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🎨 Painters
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        ⚡ Electricians
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🧱 Contractors
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🌳 Landscapers
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <GenericButton className="bg-white hover:bg-gray-100 text-amber-600 shadow-md font-semibold">
                        💼 Submit Your Bid
                      </GenericButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="p-4 border border-amber-200 rounded-lg bg-amber-50 mb-6"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-amber-900">
                            Bid #{index + 1}
                          </p>
                          <p className="text-sm text-amber-800">
                            {bid.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">
                            {formatCurrency(bid.amount || 0)}
                          </p>
                          <p className="text-xs text-amber-600">
                            {formatDate(bid.createdAt || "")}
                          </p>
                        </div>
                      </div>
                      {/* Negotiation Chat for this bid */}
                      <div className="mt-4">
                        <NegotiationChat
                          bidId={String(bid.id)}
                          initialBidData={bid}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Call to Action even when bids exist */}
                  <div className="mt-4 p-4 bg-amber-500 rounded-lg border border-amber-600">
                    <h4 className="font-semibold text-white mb-2">
                      Handle Your Project to Our Professionals?
                    </h4>
                    <p className="text-white/90 text-sm">
                      Accept or Reject the bids from our professionals.
                    </p>
                    <div className="mt-3">
                      <BidStatusDropdown bidId={project.bids[0]?.id} />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update Section */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Project Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Current Status:</span>
                  <Badge
                    variant="outline"
                    className={`text-sm ${getStatusColor(project.status)}`}
                  >
                    {getStatusIcon(project.status)} {project.status}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-amber-200">
                  <p className="text-sm text-amber-700 mb-3">Update Status:</p>
                  <Select
                    value={project.status}
                    onValueChange={(value: ProjectStatus) =>
                      handleStatusUpdate(value)
                    }
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-full border-amber-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">📝 Draft</SelectItem>
                      <SelectItem value="OPEN">🔓 Open for Bidding</SelectItem>
                      <SelectItem value="CLOSED">🔒 Closed</SelectItem>
                      <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdatingStatus && (
                    <div className="flex items-center justify-center mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                      <span className="text-sm text-amber-600 ml-2">
                        Updating...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Update Project Section */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Update Project
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-amber-700 mb-3">
                  Update project details with new values
                </p>

                {/* Project Details Form */}
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-amber-900"
                    >
                      Project Description
                    </Label>
                    <Textarea
                      id="description"
                      value={updateFormData.description}
                      onChange={(e) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="mt-1 border-amber-300 focus:border-amber-500"
                      rows={3}
                      placeholder="Enter project description..."
                    />
                  </div>

                  {/* Room Counts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="roomsCount"
                        className="text-sm font-medium text-amber-900"
                      >
                        Bedrooms
                      </Label>
                      <Input
                        id="roomsCount"
                        type="number"
                        min="0"
                        max="20"
                        value={updateFormData.roomsCount}
                        onChange={(e) =>
                          setUpdateFormData((prev) => ({
                            ...prev,
                            roomsCount: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 border-amber-300 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="bathroomsCount"
                        className="text-sm font-medium text-amber-900"
                      >
                        Bathrooms
                      </Label>
                      <Input
                        id="bathroomsCount"
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={updateFormData.bathroomsCount}
                        onChange={(e) =>
                          setUpdateFormData((prev) => ({
                            ...prev,
                            bathroomsCount: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 border-amber-300 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="kitchensCount"
                        className="text-sm font-medium text-amber-900"
                      >
                        Kitchens
                      </Label>
                      <Input
                        id="kitchensCount"
                        type="number"
                        min="1"
                        max="10"
                        value={updateFormData.kitchensCount}
                        onChange={(e) =>
                          setUpdateFormData((prev) => ({
                            ...prev,
                            kitchensCount: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="mt-1 border-amber-300 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="conversationRoomsCount"
                        className="text-sm font-medium text-amber-900"
                      >
                        Living Rooms
                      </Label>
                      <Input
                        id="conversationRoomsCount"
                        type="number"
                        min="0"
                        max="10"
                        value={updateFormData.conversationRoomsCount}
                        onChange={(e) =>
                          setUpdateFormData((prev) => ({
                            ...prev,
                            conversationRoomsCount:
                              parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 border-amber-300 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  <div>
                    <Label
                      htmlFor="estimatedCost"
                      className="text-sm font-medium text-amber-900"
                    >
                      Estimated Cost (USD)
                    </Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      min="0"
                      step="1000"
                      value={updateFormData.estimatedCost}
                      onChange={(e) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          estimatedCost: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="mt-1 border-amber-300 focus:border-amber-500"
                      placeholder="Enter estimated cost..."
                    />
                  </div>

                  {/* Extras Display (Read-only for now) */}
                  {updateFormData.extras.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-amber-900">
                        Additional Features (Current)
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {updateFormData.extras.map((extra, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-amber-500 text-amber-700 bg-white"
                          >
                            {extra.name.replace(/_/g, " ")} (
                            {extra.detail.count})
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        Features can be updated through the build house form
                      </p>
                    </div>
                  )}
                </div>

                {/* Update Button */}
                <GenericButton
                  onClick={handleUpdateProject}
                  disabled={isUpdatingProject}
                  fullWidth
                  className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600 mt-4"
                >
                  {isUpdatingProject ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Project...
                    </>
                  ) : (
                    <>🔄 Update Project</>
                  )}
                </GenericButton>
                {isUpdatingProject && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                    <span className="text-sm text-amber-600 ml-2">
                      Updating project data...
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Cost Information */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Cost Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amber-800">Estimated Cost:</span>
                  <span className="font-semibold text-amber-600 text-lg">
                    {formatCurrency(project.choosenEstimation.estimatedCost)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Project Timeline */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Project Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-amber-700">Created</p>
                  <p className="font-medium text-amber-900">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Estimation Created</p>
                  <p className="font-medium text-amber-900">
                    {formatDate(project.choosenEstimation.createdAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Owner Information */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Project Owner
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-amber-700">Name</p>
                  <p className="font-medium text-amber-900">
                    {project.owner.firstName} {project.owner.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Email</p>
                  <p className="font-medium text-amber-900">
                    {project.owner.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Phone</p>
                  <p className="font-medium text-amber-900">
                    {project.owner.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Role</p>
                  <Badge
                    variant="outline"
                    className="border-amber-500 text-amber-700 bg-white"
                  >
                    {project.owner.role}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Professional Opportunities */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Professional Opportunities
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-amber-700 mb-2">
                    This project needs:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🏗️ Architecture
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🔧 Plumbing
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      ⚡ Electrical
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🎨 Painting
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🧱 Construction
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🌳 Landscaping
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🏠 Interior Design
                    </Badge>
                  </div>
                </div>
                <div className="pt-3 border-t border-amber-200">
                  <p className="text-sm text-amber-700 mb-2">Current Bids:</p>
                  <p className="font-semibold text-lg text-amber-600">
                    {project.bids.length}{" "}
                    {project.bids.length === 1 ? "bid" : "bids"}
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-200">
                  <GenericButton
                    variant="outline"
                    fullWidth
                    className="text-amber-600 border-amber-500 hover:bg-amber-50 bg-white"
                  >
                    💼 Your Bids
                  </GenericButton>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

const BidStatusDropdown: React.FC<{ bidId: string }> = ({ bidId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<BidStatus | null>(
    null
  );

  const handleStatusChange = async (status: BidStatus) => {
    setIsLoading(true);
    setSelectedStatus(status);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please login first.");
        setIsLoading(false);
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/v1/bids/${bidId}/status`,
        {
          method: "PATCH",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update bid status");
      toast.success(`Bid status updated to ${status}!`);
    } catch (e: any) {
      toast.error(e.message || "Failed to update bid status");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-white shadow-sm px-4 py-2 bg-white text-amber-600 font-semibold hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500 mr-2"></span>
            Processing...
          </span>
        ) : (
          <>
            💼{" "}
            {selectedStatus
              ? `Status: ${selectedStatus}`
              : "Accept/Update Bid Status"}
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.846a.75.75 0 01-1.02 0l-4.25-3.846a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </>
        )}
      </button>
      {isOpen && !isLoading && (
        <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {Object.values(BidStatus).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-100 hover:text-amber-900"
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
