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

  // Get API response from form data
  const apiResponse = formData.apiResponse;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBudget) {
      toast.error("Please select a budget range before proceeding.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Starting project creation...");
      console.log("🚀 Selected budget value:", selectedBudget);
      console.log("🚀 Form data:", formData);
      console.log("🚀 API Response:", formData.apiResponse);
      console.log("🏠 Stored House Summary:", formData.houseSummary);
      console.log("📅 Timeline:", formData.timeline);

      // Find the selected budget option details
      const selectedBudgetOption = costOptions.find(
        (opt) => opt.value === selectedBudget
      );
      console.log("📊 Selected Budget Option Details:", selectedBudgetOption);

      // Log all available cost options for comparison
      console.log("📋 All Available Cost Options:", costOptions);

      // Get the authentication token
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login first.");
      }

      console.log("🚀 Auth token found:", token.substring(0, 20) + "...");

      // Extract estimation ID from the API response based on selected budget
      let choosenEstimationId = "";

      if (selectedBudget.startsWith("main-")) {
        // This is the main estimate from API response
        console.log("🚀 Main estimate selected");
        console.log("🔍 Main API Response ID:", formData.apiResponse?.id);
        console.log("🔍 Main API Response Full:", formData.apiResponse);

        // Use the ID from the main API response
        if (formData.apiResponse && formData.apiResponse.id) {
          choosenEstimationId = formData.apiResponse.id;
          console.log("🚀 Using main estimate ID:", choosenEstimationId);
        } else {
          console.error("❌ No ID found in main API response");
          console.error(
            "❌ Available fields in API response:",
            Object.keys(formData.apiResponse || {})
          );
          throw new Error("No ID found in main API response");
        }
      } else if (selectedBudget.startsWith("suggestion-")) {
        // This is a suggestion from API response
        const parts = selectedBudget.split("-");
        const suggestionIndex = parseInt(parts[1]);
        console.log("🚀 Suggestion selected, index:", suggestionIndex);
        console.log(
          "🔍 All suggestions from API:",
          formData.apiResponse?.suggestions
        );

        // Get the ID from the specific suggestion
        if (
          formData.apiResponse &&
          formData.apiResponse.suggestions &&
          formData.apiResponse.suggestions[suggestionIndex]
        ) {
          const selectedSuggestion =
            formData.apiResponse.suggestions[suggestionIndex];
          console.log("🔍 Selected suggestion object:", selectedSuggestion);
          console.log(
            "🔍 Available fields in suggestion:",
            Object.keys(selectedSuggestion)
          );

          choosenEstimationId = selectedSuggestion.id;
          console.log("🚀 Using suggestion ID:", choosenEstimationId);
          console.log("🚀 Selected suggestion:", selectedSuggestion);
        } else {
          console.error("❌ No suggestion found at index:", suggestionIndex);
          console.error(
            "❌ Available suggestions:",
            formData.apiResponse?.suggestions?.length || 0
          );
          throw new Error(`No suggestion found at index ${suggestionIndex}`);
        }
      } else {
        // This is a default budget option - we might not have an ID for this
        console.log("🚀 Default budget option selected:", selectedBudget);
        console.log("🔍 This is a default option, no API ID available");
        // For default options, we might need to handle differently
        // For now, we'll use the selected budget value
        choosenEstimationId = selectedBudget;
      }

      if (!choosenEstimationId) {
        console.error("❌ No estimation ID found for the selected budget");
        console.error("❌ Selected budget:", selectedBudget);
        console.error("❌ Available options:", costOptions);
        throw new Error("No estimation ID found for the selected budget");
      }

      console.log("🚀 Final estimation ID:", choosenEstimationId);
      console.log("🚀 Budget selection summary:", {
        selectedValue: selectedBudget,
        selectedOption: selectedBudgetOption,
        extractedId: choosenEstimationId,
        isMainEstimate: selectedBudget.startsWith("main-"),
        isSuggestion: selectedBudget.startsWith("suggestion-"),
        isDefault:
          !selectedBudget.startsWith("main-") &&
          !selectedBudget.startsWith("suggestion-"),
      });

      // Make additional API call to get description using the estimation ID
      console.log("🚀 Making additional API call to get description...");
      console.log(
        "🚀 Description API endpoint: http://localhost:3000/api/v1/estimator/id/description"
      );
      console.log("🚀 Using PUT method to update description");
      console.log("🚀 Estimation ID for PUT request:", choosenEstimationId);

      let descriptionFromAPI = "";
      try {
        const putRequestBody = {
          description:
            formData.houseSummary?.fullDescription ||
            "House construction project with selected specifications.",
        };

        console.log("📤 PUT Request Body:", putRequestBody);
        console.log(
          "🔑 Auth Token:",
          token ? `${token.substring(0, 20)}...` : "No token"
        );

        const descriptionResponse = await axios.put(
          `http://localhost:3000/api/v1/estimator/${choosenEstimationId}/description`,
          putRequestBody,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "✅ Description API Response Status:",
          descriptionResponse.status
        );
        console.log(
          "✅ Description API Response Data:",
          descriptionResponse.data
        );

        descriptionFromAPI = (descriptionResponse.data as any).description;
        console.log("📝 Description from API:", descriptionFromAPI);
      } catch (descriptionError: any) {
        console.error("❌ Description API Error:", descriptionError);
        console.error(
          "❌ Description API Error Status:",
          descriptionError.response?.status
        );
        console.error(
          "❌ Description API Error Data:",
          descriptionError.response?.data
        );

        // Continue with the process even if description update fails
        descriptionFromAPI =
          formData.houseSummary?.fullDescription ||
          "House construction project with selected specifications.";
        console.log("⚠️ Using fallback description:", descriptionFromAPI);
      }

      // Create the final project request body
      const projectRequestBody = {
        choosenEstimationId: choosenEstimationId,
        description: descriptionFromAPI,
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
    } catch (error: any) {
      console.error("❌ Project creation error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid project data. Please check your inputs.");
      } else {
        toast.error("Failed to create project. Please try again.");
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
    <>
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
                    {formData.squareFootage?.toLocaleString() ||
                      "Not specified"}{" "}
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
                    placeholder="Enter your full name"
                    className="h-12 border-amber-300 focus:border-amber-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 border-amber-300 focus:border-amber-500"
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
                  placeholder="Enter your phone number"
                  className="h-12 border-amber-300 focus:border-amber-500"
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
                  acknowledge that your project will be published for
                  professional bidding once submitted.
                </p>
              </div>
            </div>
          </Card>

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
              {isSubmitting ? "Submitting..." : "Submit Project"}
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
                <path d="M22 2L11 13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </GenericButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
