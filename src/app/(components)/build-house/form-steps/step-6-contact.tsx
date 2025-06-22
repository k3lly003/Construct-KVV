/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { projectService, ProjectStatus } from "@/app/services/projectServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { convertFormDataToProjectUpdate } from "@/app/services/projectServices";

export function StepSixContact() {
  const {
    formData,
    updateFormData,
    prevStep,
    completeForm,
    isLastStep,
    resetForm,
    goToStep,
  } = useFormContext();
  const [selectedBudget, setSelectedBudget] = useState(formData.budget || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>("DRAFT");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [projectId, setProjectId] = useState("");

  // Get API response from form data
  const apiResponse = formData.apiResponse;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Step 6 - Form Submit Triggered");
    console.log("📝 Form Data at Submit:", formData);

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all contact information.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please login first.");
        setIsSubmitting(false);
        return;
      }

      if (isUpdateMode && !projectId) {
        toast.error("Please enter a valid project ID to update.");
        setIsSubmitting(false);
        return;
      }

      if (isUpdateMode) {
        // Update existing project
        console.log("🔄 Updating existing project:", projectId);

        const projectUpdateData = convertFormDataToProjectUpdate(formData);

        console.log("📝 Project update data:", projectUpdateData);

        const updateResponse = await axios.put(
          `http://localhost:3000/api/v1/final-project/${projectId}`,
          projectUpdateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "✅ Project Update API Response Status:",
          updateResponse.status
        );
        console.log(
          "✅ Project Update API Response Data:",
          updateResponse.data
        );

        toast.success("Project updated successfully! 🎉", {
          style: {
            background: "white",
            color: "#92400e",
            border: "1px solid #f59e0b",
          },
        });

        // Navigate to projects page after a short delay
        setTimeout(() => {
          window.location.href = "/projects";
        }, 2000);
      } else {
        // Create new project (existing logic)
        const projectRequestBody = {
          roomsCount: formData.bedrooms || 0,
          bathroomsCount: formData.bathrooms || 0,
          kitchensCount: 1, // Default to 1 kitchen
          conversationRoomsCount: 0, // Default to 0 conversation rooms
          extras:
            formData.apiResponse?.features?.map((feature: any) => ({
              name: feature.name || feature.type || "feature",
              detail: { count: feature.count || 1 },
            })) || [],
          description:
            formData.apiResponse?.description ||
            formData.houseSummary?.fullDescription ||
            `${formData.bedrooms || 0}-bedroom ${
              formData.projectType || "residential"
            } home`,
          estimatedCost:
            formData.apiResponse?.estimatedCost ||
            formData.apiResponse?.totalCost ||
            25000000, // Default cost
        };

        console.log("📤 Final Project Request Body:", projectRequestBody);

        // Make the final API call to create the project
        const projectResponse = await axios.post(
          "http://localhost:3000/api/v1/final-project",
          projectRequestBody,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "✅ Project Creation API Response Status:",
          projectResponse.status
        );
        console.log(
          "✅ Project Creation API Response Data:",
          projectResponse.data
        );

        // Show success message
        toast.success("Project created successfully! 🎉");
        console.log("🎉 Project creation completed successfully!");

        // Complete the form
        completeForm();

        // Navigate to projects page after a short delay
        setTimeout(() => {
          window.location.href = "/projects";
        }, 2000);
      }
    } catch (error: any) {
      console.error("❌ Project operation error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid project data. Please check your inputs.");
      } else if (error.response?.status === 404 && isUpdateMode) {
        toast.error("Project not found. Please check the project ID.");
      } else {
        toast.error(
          `Failed to ${
            isUpdateMode ? "update" : "create"
          } project. Please try again.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCostOptions = () => {
    const options = [];

    // Add main estimate from API response if available
    if (formData.apiResponse && formData.apiResponse.estimatedCost) {
      options.push({
        value: "main-estimate",
        label: `Main Estimate: $${formData.apiResponse.estimatedCost.toLocaleString()}`,
        description: "Recommended based on your specifications",
        cost: formData.apiResponse.estimatedCost,
      });
    }

    // Add suggestions from API response if available
    if (formData.apiResponse && formData.apiResponse.suggestions) {
      formData.apiResponse.suggestions.forEach(
        (suggestion: any, index: number) => {
          options.push({
            value: `suggestion-${index}`,
            label: `Option ${
              index + 1
            }: $${suggestion.estimatedCost.toLocaleString()}`,
            description:
              suggestion.description || `Alternative option ${index + 1}`,
            cost: suggestion.estimatedCost,
          });
        }
      );
    }

    // Add default options if no API response
    if (!formData.apiResponse) {
      options.push(
        {
          value: "budget-friendly",
          label: "Budget Friendly: $150,000 - $250,000",
          description: "Cost-effective construction with quality materials",
          cost: 200000,
        },
        {
          value: "standard",
          label: "Standard: $250,000 - $400,000",
          description: "Balanced quality and cost",
          cost: 325000,
        },
        {
          value: "premium",
          label: "Premium: $400,000 - $600,000",
          description: "High-end materials and finishes",
          cost: 500000,
        },
        {
          value: "luxury",
          label: "Luxury: $600,000+",
          description: "Custom luxury home with premium features",
          cost: 750000,
        }
      );
    }

    return options;
  };

  const costOptions = generateCostOptions();

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!apiResponse?.id) {
      toast.error("No project ID available for status update");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      console.log(
        "🔄 Updating project status from",
        currentStatus,
        "to",
        newStatus
      );

      await projectService.updateProjectStatus(apiResponse.id, newStatus);

      setCurrentStatus(newStatus);
      console.log("✅ Project status updated successfully");
      toast.success(`Project status updated to ${newStatus} successfully! 🎉`);
    } catch (error) {
      console.error("❌ Error updating project status:", error);
      toast.error("Failed to update project status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Project Status & Contact
        </h2>
        <p className="text-muted-foreground mt-2">
          Review your project details and update the status. Your project is
          ready to be published for bidding!
        </p>
      </div>

      <div className="space-y-8">
        {/* Project Status Update Section */}
        {apiResponse?.id && (
          <Card className="p-6 border-amber-200 bg-white shadow-lg">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              🚀 Project Status Management
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">
                  Current Status:
                </span>
                <Badge
                  variant="outline"
                  className={`text-sm ${getStatusColor(currentStatus)}`}
                >
                  {getStatusIcon(currentStatus)} {currentStatus}
                </Badge>
              </div>

              <div className="pt-3 border-t border-amber-200">
                <p className="text-sm text-amber-700 mb-3">
                  Update Project Status:
                </p>
                <div className="flex items-center space-x-3">
                  <Select
                    value={currentStatus}
                    onValueChange={(value: ProjectStatus) =>
                      handleStatusUpdate(value)
                    }
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-48 border-amber-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">
                        📝 Draft - Project is being prepared
                      </SelectItem>
                      <SelectItem value="OPEN">
                        🔓 Open for Bidding - Accepting professional bids
                      </SelectItem>
                      <SelectItem value="CLOSED">
                        🔒 Closed - No more bids accepted
                      </SelectItem>
                      <SelectItem value="COMPLETED">
                        ✅ Completed - Project finished
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdatingStatus && (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                      <span className="text-sm text-amber-600 ml-2">
                        Updating...
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  💡 <strong>DRAFT:</strong> Keep private while planning •{" "}
                  <strong>OPEN:</strong> Publish for bidding •{" "}
                  <strong>CLOSED:</strong> Stop accepting bids •{" "}
                  <strong>COMPLETED:</strong> Mark as finished
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Project Summary */}
        <Card className="p-6 border-amber-200 bg-white shadow-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            📋 Project Summary
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-700">Project Type</p>
                <p className="font-medium text-amber-900 capitalize">
                  {formData.projectType || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700">Square Footage</p>
                <p className="font-medium text-amber-900">
                  {formData.squareFootage?.toLocaleString() || "Not specified"}{" "}
                  sq ft
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700">Bedrooms</p>
                <p className="font-medium text-amber-900">
                  {formData.bedrooms || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700">Bathrooms</p>
                <p className="font-medium text-amber-900">
                  {formData.bathrooms || 0}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-amber-700">Description</p>
              <p className="font-medium text-amber-900">
                {apiResponse?.description ||
                  "Project description will be generated"}
              </p>
            </div>
          </div>
        </Card>

        {/* Cost Comparison */}
        {apiResponse && (
          <Card className="p-6 border-amber-200 bg-white shadow-lg">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              💰 Cost Analysis & Comparison
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-amber-900">
                    Your Estimate
                  </div>
                  <div className="text-lg font-bold text-amber-600">
                    $
                    {formData.squareFootage
                      ? (formData.squareFootage * 150).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium text-green-900">
                    Optimized Cost
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ${apiResponse.estimatedCost?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl mb-2">💡</div>
                  <div className="text-sm font-medium text-blue-900">
                    Potential Savings
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    $
                    {(
                      (formData.squareFootage
                        ? formData.squareFootage * 150
                        : 0) - (apiResponse.estimatedCost || 0)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-2">
                  🎯 Cost Optimization Recommendations
                </h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Material selection optimization</li>
                  <li>• Labor cost efficiency</li>
                  <li>• Timeline optimization</li>
                  <li>• Resource allocation improvements</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="p-6 border-amber-200 bg-white shadow-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            📞 Contact Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-base">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="h-12"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  className="h-12"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-base">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                className="h-12"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-base">
                Additional Notes
              </Label>
              <textarea
                id="message"
                placeholder="Any additional requirements or notes..."
                className="w-full h-24 p-3 border border-amber-300 rounded-md focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Agreement */}
        <Card className="p-6 border-amber-200 bg-white shadow-lg">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreement"
              className="mt-1 w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
            />
            <div>
              <Label htmlFor="agreement" className="text-base cursor-pointer">
                I agree to the terms and conditions
              </Label>
              <p className="text-sm text-amber-700 mt-1">
                By checking this box, you agree to our terms of service and
                acknowledge that your project will be published for professional
                bidding once submitted.
              </p>
            </div>
          </div>
        </Card>

        {/* Mode Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project Operation</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="create"
                checked={!isUpdateMode}
                onChange={() => setIsUpdateMode(false)}
                className="text-amber-600"
              />
              <span className="text-sm">Create New Project</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="update"
                checked={isUpdateMode}
                onChange={() => setIsUpdateMode(true)}
                className="text-amber-600"
              />
              <span className="text-sm">Update Existing Project</span>
            </label>
          </div>
        </div>

        {/* Project ID Input for Update Mode */}
        {isUpdateMode && (
          <div className="space-y-2">
            <Label htmlFor="projectId" className="text-base">
              Project ID to Update
            </Label>
            <Input
              id="projectId"
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-12"
              placeholder="Enter the project ID you want to update"
              required={isUpdateMode}
            />
            <p className="text-sm text-muted-foreground">
              You can find the project ID in the projects list or project
              details page.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between space-x-4">
          <GenericButton
            type="button"
            variant="outline"
            size="lg"
            onClick={prevStep}
            className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Previous
          </GenericButton>
          <GenericButton
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-white shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isUpdateMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isUpdateMode ? "Update Project" : "Create Project"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </GenericButton>
        </div>
      </div>
    </motion.div>
  );
}
