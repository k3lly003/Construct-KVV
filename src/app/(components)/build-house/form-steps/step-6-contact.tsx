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

// --- BudgetRadioSection Component ---
function BudgetRadioSection({
  apiResponse,
  selectedId,
  setSelectedId,
  disabled,
}: {
  apiResponse: any;
  selectedId: string;
  setSelectedId: (id: string) => void;
  disabled: boolean;
}) {
  // Extract options: main estimate and suggestions
  const mainEstimate =
    apiResponse && apiResponse.estimatedCost && apiResponse.id
      ? [
          {
            id: apiResponse.id,
            label: `Main Estimate: Rwf ${apiResponse.estimatedCost.toLocaleString()}`,
            description:
              apiResponse.description ||
              "Recommended based on your specifications",
            cost: apiResponse.estimatedCost,
          },
        ]
      : [];

  const suggestions = Array.isArray(apiResponse?.suggestions)
    ? apiResponse.suggestions.map((sugg: any, idx: number) => ({
        id: sugg.id,
        label: `Option ${idx + 1}: Rwf ${
          sugg.estimatedCost?.toLocaleString?.() ?? ""
        }`,
        description: sugg.description || `Alternative option ${idx + 1}`,
        cost: sugg.estimatedCost,
      }))
    : [];

  const options = [...mainEstimate, ...suggestions];

  return (
    <RadioGroup
      value={selectedId}
      onValueChange={setSelectedId}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
      disabled={disabled}
    >
      {options.map((option) => (
        <Label
          key={option.id}
          htmlFor={`budget-${option.id}`}
          className={`flex items-center justify-between rounded-md border-2 cursor-pointer p-4 hover:bg-accent transition-colors duration-200 ${
            selectedId === option.id
              ? "border-primary bg-accent"
              : "border-input"
          }`}
        >
          <div>
            <div className="font-medium text-amber-900">{option.label}</div>
            <div className="text-xs text-amber-700 mt-1">
              {option.description}
            </div>
          </div>
          <RadioGroupItem
            value={option.id}
            id={`budget-${option.id}`}
            disabled={disabled}
          />
        </Label>
      ))}
    </RadioGroup>
  );
}

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
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>("DRAFT");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [projectId, setProjectId] = useState("");

  // Get API response from form data
  const apiResponse = formData.apiResponse;
  const houseSummary = formData.houseSummary;

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBudgetId) {
      toast.error("Please select a budget estimate.");
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

      // 1. Update description for the selected estimation
      const description =
        houseSummary?.fullDescription ||
        "Updated modern house description with luxury features";
      await axios.put(
        `http://localhost:3000/api/v1/estimator/${selectedBudgetId}/description`,
        { description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Create final project with the chosen estimation ID
      await axios.post(
        "http://localhost:3000/api/v1/final-project",
        { choosenEstimationId: selectedBudgetId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Project created successfully! 🎉");
      completeForm();
      setTimeout(() => {
        window.location.href = "/projects";
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PROJECT SUMMARY RENDER ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Project Status</h2>
        <p className="text-muted-foreground mt-2">
          Review your project details . Your project is ready to be published
          for bidding!
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Project Summary */}
          <Card className="p-6 border-amber-200 bg-white shadow-lg">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              📋 Project Summary
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-amber-700">
                    🏠 Project Type
                  </span>
                  <span className="font-bold text-amber-900 capitalize">
                    {formData.projectType || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-amber-700">
                    📏 Square Footage
                  </span>
                  <span className="font-bold text-amber-900">
                    {formData.squareFootage?.toLocaleString() ||
                      "Not specified"}{" "}
                    sq ft
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-amber-700">🛏️ Bedrooms</span>
                  <span className="font-bold text-amber-900">
                    {formData.bedrooms || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-amber-700">🛁 Bathrooms</span>
                  <span className="font-bold text-amber-900">
                    {formData.bathrooms || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-amber-700">📈 Confidence</span>
                  <span className="font-bold text-amber-900">
                    {apiResponse?.confidence
                      ? apiResponse.confidence
                      : "Not specified"}
                  </span>
                </div>
                {/* Recommendations */}
                <div className="md:col-span-2 flex flex-col items-start space-y-1 mt-2">
                  <span className="text-sm text-amber-700 mb-1">
                    💡 Recommendations
                  </span>
                  {apiResponse?.feasibilityAnalysis?.recommendations &&
                  apiResponse.feasibilityAnalysis.recommendations.length > 0 ? (
                    <ul className="list-none pl-0 space-y-1 w-full">
                      {apiResponse.feasibilityAnalysis.recommendations.map(
                        (rec: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2 text-amber-900"
                          >
                            <span className="text-lg">
                              {idx % 3 === 0
                                ? "💡"
                                : idx % 3 === 1
                                ? "✅"
                                : "🛠️"}
                            </span>
                            <span className="font-medium leading-snug">
                              {rec}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="font-bold text-amber-900">
                      No recommendations available
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-amber-700">📝 Description</p>
                <p className="font-medium text-amber-900">
                  {houseSummary?.fullDescription ||
                    apiResponse?.description ||
                    "Project description will be generated"}
                </p>
              </div>
            </div>
            {/* --- BUDGET SECTION --- */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-amber-900 mb-2">
                💰 Select Your Budget Estimate
              </h4>
              <p className="text-sm text-amber-700 mb-4">
                Choose one of the available cost estimates for your project.
                This will be submitted as your preferred budget.
              </p>
              <BudgetRadioSection
                apiResponse={apiResponse}
                selectedId={selectedBudgetId}
                setSelectedId={setSelectedBudgetId}
                disabled={isSubmitting}
              />
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
              disabled={isSubmitting || !selectedBudgetId}
              className="bg-amber-500 hover:bg-amber-600 text-white shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  Create Project
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
      </form>
    </motion.div>
  );
}
