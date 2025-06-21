/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import axios from "axios";

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

        if (
          descriptionResponse.data &&
          (descriptionResponse.data as any).description
        ) {
          descriptionFromAPI = (descriptionResponse.data as any).description;
          console.log("📝 Retrieved description from API:", descriptionFromAPI);
        } else {
          console.log(
            "⚠️ No description found in API response, using stored summary"
          );
        }
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
        console.log("⚠️ Using stored house summary as fallback");
      }

      // Use the API description if available, otherwise use the stored house summary
      let finalDescription = "";
      if (descriptionFromAPI) {
        finalDescription = descriptionFromAPI;
        console.log("📝 Using API description for final request");
      } else if (
        formData.houseSummary &&
        formData.houseSummary.fullDescription
      ) {
        finalDescription = formData.houseSummary.fullDescription;
        console.log("📝 Using stored house summary for final request");
        console.log("📝 Stored summary:", formData.houseSummary);
      } else {
        // Fallback to a basic description
        finalDescription =
          "House construction project with selected specifications.";
        console.log("📝 Using fallback description");
      }

      console.log("📝 Final description to be sent:", finalDescription);

      // Prepare the request body with description
      const requestBody = {
        choosenEstimationId: choosenEstimationId,
      };

      console.log("🚀 Final request body:", requestBody);
      console.log(
        "🚀 API endpoint: http://localhost:3000/api/v1/final-project"
      );

      // Make the API call
      const response = await axios.post(
        "http://localhost:3000/api/v1/final-project",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ API Response Status:", response.status);
      console.log("✅ API Response Data:", response.data);

      // Show success toast
      toast.success("🎉 Your project has been initialized successfully!", {
        description:
          "We've forwarded it to make all bids on it. You'll be notified of updates.",
        duration: 5000,
      });

      // Reset form and go to first step
      setTimeout(() => {
        console.log("🔄 Resetting form and going to step 1...");
        resetForm();
        goToStep(1);
      }, 2000);
    } catch (error: any) {
      console.error("❌ Project creation error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create project";
      toast.error("❌ Project creation failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate cost options from API response
  const generateCostOptions = () => {
    const options = [];

    // Add the main estimated cost from API response
    if (formData.apiResponse && formData.apiResponse.estimatedCost) {
      options.push({
        value: `main-${formData.apiResponse.estimatedCost}`,
        label: `${formData.apiResponse.estimatedCost.toLocaleString()} Rfw`,
        description: "Recommended based on your specifications",
        isRecommended: true,
        cost: formData.apiResponse.estimatedCost,
      });
    }

    // Add suggestions from API response
    if (formData.apiResponse && formData.apiResponse.suggestions) {
      formData.apiResponse.suggestions.forEach(
        (suggestion: any, index: number) => {
          if (suggestion && suggestion.estimatedCost) {
            options.push({
              value: `suggestion-${index}-${suggestion.estimatedCost}`,
              label: `${suggestion.estimatedCost.toLocaleString()} Rfw`,
              description: suggestion.description || "Alternative option",
              isRecommended: false,
              cost: suggestion.estimatedCost,
            });
          }
        }
      );
    }

    // If no API data, provide default options
    if (options.length === 0) {
      options.push(
        {
          value: "Above_100m Rfw",
          label: "Above 100m Rfw",
          description: "Premium luxury options",
          isRecommended: true,
          cost: 100000000,
        },
        {
          value: "under_100m Rfw",
          label: "Under 100m Rfw",
          description: "High-end options",
          isRecommended: false,
          cost: 90000000,
        },
        {
          value: "50m Rfw - 90m Rfw",
          label: "50m Rfw - 90m Rfw",
          description: "Mid-range options",
          isRecommended: false,
          cost: 70000000,
        },
        {
          value: "10m Rfw - 25m Rfw",
          label: "10m Rfw - 25m Rfw",
          description: "Standard options",
          isRecommended: false,
          cost: 17500000,
        },
        {
          value: "5m Rfw - 9.5m Rfw",
          label: "5m Rfw - 9.5m Rfw",
          description: "Budget-friendly options",
          isRecommended: false,
          cost: 7250000,
        },
        {
          value: "above_1m Rfw",
          label: "Above 1m Rfw",
          description: "Basic options",
          isRecommended: false,
          cost: 1500000,
        }
      );
    }

    return options;
  };

  const costOptions = generateCostOptions();

  return (
    <>
      <Toaster richColors position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Cost & Budget Selection
          </h2>
          <p className="text-muted-foreground mt-2">
            Review the estimated costs and select your preferred budget range.
          </p>
        </div>

        {/* Cost Comparison Section */}
        {formData.apiResponse && (
          <Card className="p-6 mb-6 bg-green-50 border-green-200">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                💰 Cost Analysis & Recommendations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700">
                    Primary Estimate
                  </h4>
                  <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                    <div className="text-2xl font-bold text-green-800">
                      {formData.apiResponse.estimatedCost?.toLocaleString()} Rfw
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Based on your specifications
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-green-700">
                    Project Confidence
                  </h4>
                  <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                    <div className="text-lg font-semibold text-green-800 capitalize">
                      {formData.apiResponse.confidence || "High"}
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Feasibility assessment
                    </p>
                  </div>
                </div>
              </div>

              {formData.apiResponse.description && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">
                    Project Description
                  </h4>
                  <p className="text-green-700 text-sm">
                    {formData.apiResponse.description}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cost Options Selection */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  💡 Select Your Budget Range
                </h3>
                <p className="text-muted-foreground">
                  Choose the budget range that best fits your project
                  requirements
                </p>
              </div>

              <RadioGroup
                value={selectedBudget}
                onValueChange={setSelectedBudget}
                className="space-y-4"
              >
                {costOptions.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`budget-${option.value}`}
                    className={`
                      flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer
                      hover:bg-accent/50 transition-all duration-200
                      ${
                        selectedBudget === option.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }
                      ${
                        option.isRecommended
                          ? "ring-2 ring-green-200 bg-green-50/50"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <RadioGroupItem
                        value={option.value}
                        id={`budget-${option.value}`}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-800">
                            {option.label}
                          </span>
                          {option.isRecommended && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Cost comparison indicator */}
                    {option.isRecommended && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </Label>
                ))}
              </RadioGroup>

              {/* Budget Selection Summary */}
              {selectedBudget && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Selected Budget Range
                  </h4>
                  <p className="text-blue-700">
                    {costOptions.find((opt) => opt.value === selectedBudget)
                      ?.label || selectedBudget}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {
                      costOptions.find((opt) => opt.value === selectedBudget)
                        ?.description
                    }
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Final Summary */}
          <Card className="p-6 bg-gray-50">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                🎉 Ready to Proceed!
              </h3>
              <p className="text-gray-600">
                Your house design is complete. We'll use your selected budget
                range to create the perfect design for your dream home.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                <span>All specifications have been reviewed and confirmed</span>
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <GenericButton
              type="button"
              onClick={prevStep}
              variant="outline"
              size="lg"
              disabled={isSubmitting}
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </GenericButton>
            <GenericButton
              type="submit"
              size="lg"
              disabled={!selectedBudget || isSubmitting}
              className={
                !selectedBudget || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Project...
                </>
              ) : (
                <>
                  Complete Project
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
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </>
              )}
            </GenericButton>
          </div>
        </form>
      </motion.div>
    </>
  );
}
