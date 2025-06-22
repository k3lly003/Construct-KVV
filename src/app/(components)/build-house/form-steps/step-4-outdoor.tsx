"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

export function StepFourOutdoor() {
  const { formData, updateFormData, nextStep, prevStep, setApiResponse } =
    useFormContext();
  const [selectedCostOptimizations, setSelectedCostOptimizations] = useState<
    string[]
  >([]);
  const [isClient, setIsClient] = useState(false);

  console.log("🌳 Step 4 - Outdoor Component Rendered");
  console.log("📊 Current Form Data:", formData);
  console.log("🌿 Outdoor Selections:", {
    landscapeStyle: formData.landscapeStyle,
    hasDeck: formData.hasDeck,
    hasPool: formData.hasPool,
    hasOutdoorKitchen: formData.hasOutdoorKitchen,
    outdoorNotes: formData.outdoorNotes,
  });
  console.log("💰 Selected Cost Optimizations:", selectedCostOptimizations);
  console.log("📡 API Response Available:", !!formData.apiResponse);
  console.log("🖥️ Is Client:", isClient);

  // Fix hydration issues by ensuring component renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug logging for initial load only
  useEffect(() => {
    if (isClient && formData.apiResponse) {
      console.log("🔍 Step 4 - Initial load - API Response structure:", {
        hasCostOptimizations: !!formData.apiResponse.costOptimizations,
        hasSuggestions: !!formData.apiResponse.suggestions,
        hasFeasibilityAnalysis: !!formData.apiResponse.feasibilityAnalysis,
      });
    }
  }, [isClient, formData.apiResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Step 4 - Form Submit Triggered");
    console.log("🌿 Outdoor Selections at Submit:", {
      landscapeStyle: formData.landscapeStyle,
      hasDeck: formData.hasDeck,
      hasPool: formData.hasPool,
      hasOutdoorKitchen: formData.hasOutdoorKitchen,
      outdoorNotes: formData.outdoorNotes,
    });
    console.log("💰 Cost Optimizations at Submit:", selectedCostOptimizations);

    updateDescriptionWithStep4Selections();
    console.log("✅ Step 4 - Proceeding to next step");
    nextStep();
  };

  const updateDescriptionWithStep4Selections = () => {
    console.log("📝 Step 4 - Updating Description with Outdoor Selections");

    if (!formData.apiResponse) {
      console.log(
        "⚠️ Step 4 - No API response available for description update"
      );
      return;
    }

    const baseDescription = formData.apiResponse.description || "";
    console.log("📝 Step 4 - Base Description:", baseDescription);

    // Build step 4 additions - only cost optimizations
    const step4Additions = [];

    if (selectedCostOptimizations.length > 0) {
      const optimizationsText = selectedCostOptimizations.join(", ");
      step4Additions.push(`cost optimizations: ${optimizationsText}`);
    }

    console.log("💰 Step 4 - Cost Optimization Additions:", step4Additions);

    // Create meaningful sentence
    let step4Description = "";
    if (step4Additions.length > 0) {
      step4Description = ` with ${step4Additions.join(", ")}`;
    }

    // Combine base description with step 4 additions
    const updatedDescription = baseDescription + step4Description;
    console.log("📝 Step 4 - Updated Description:", updatedDescription);

    // Update the API response with the new description
    const updatedApiResponse = {
      ...formData.apiResponse,
      description: updatedDescription,
      step4Selections: {
        costOptimizations: selectedCostOptimizations,
      },
    };

    console.log("🔄 Step 4 - Updated API Response:", updatedApiResponse);
    setApiResponse(updatedApiResponse);
  };

  const generateLiveDescription = () => {
    if (!formData.apiResponse) return "No API response available";

    const baseDescription = formData.apiResponse.description || "";

    // Build step 4 additions - only cost optimizations
    const step4Additions = [];

    if (selectedCostOptimizations.length > 0) {
      const optimizationsText = selectedCostOptimizations.join(", ");
      step4Additions.push(`cost optimizations: ${optimizationsText}`);
    }

    // Create meaningful sentence
    let step4Description = "";
    if (step4Additions.length > 0) {
      step4Description = ` with ${step4Additions.join(", ")}`;
    }

    return baseDescription + step4Description;
  };

  const handleCostOptimizationChange = useCallback(
    (optimization: string, checked: boolean) => {
      console.log("🔄 handleCostOptimizationChange called:", {
        optimization,
        checked,
      });

      setSelectedCostOptimizations((prevOptimizations) => {
        if (checked) {
          // Add if not already present
          return prevOptimizations.includes(optimization)
            ? prevOptimizations
            : [...prevOptimizations, optimization];
        } else {
          // Remove if present
          return prevOptimizations.filter((opt) => opt !== optimization);
        }
      });
    },
    []
  );

  // Generate cost optimization options from API response
  const getCostOptimizationOptions = () => {
    try {
      if (!formData.apiResponse) {
        console.log("📋 No API response available, using default options");
        return [
          "Use standard materials instead of premium",
          "Reduce square footage by 10%",
          "Simplify roof design",
          "Use energy-efficient but standard windows",
          "Opt for basic landscaping",
          "Choose standard fixtures",
          "Reduce number of bathrooms",
          "Use prefabricated components",
        ];
      }

      // Extract cost optimization suggestions from API response
      const apiResponse = formData.apiResponse;
      const optimizations: string[] = [];

      // Helper function to clean optimization text
      const cleanOptimizationText = (text: string): string => {
        if (!text || typeof text !== "string") return "";
        // Remove "- " prefix if it exists
        return text.replace(/^-\s*/, "").trim();
      };

      // Check for costOptimizations (array of strings)
      if (
        apiResponse.costOptimizations &&
        Array.isArray(apiResponse.costOptimizations)
      ) {
        apiResponse.costOptimizations.forEach((opt: any) => {
          if (typeof opt === "string") {
            const cleaned = cleanOptimizationText(opt);
            if (cleaned) optimizations.push(cleaned);
          }
        });
      }

      // Check for suggestions (array of objects with description field)
      if (apiResponse.suggestions && Array.isArray(apiResponse.suggestions)) {
        apiResponse.suggestions.forEach((suggestion: any) => {
          if (suggestion && typeof suggestion === "object") {
            // Extract description from suggestion object
            if (
              suggestion.description &&
              typeof suggestion.description === "string"
            ) {
              const cleaned = cleanOptimizationText(suggestion.description);
              if (cleaned) optimizations.push(cleaned);
            }
            // Extract other relevant fields if needed
            if (suggestion.extras && typeof suggestion.extras === "string") {
              const cleaned = cleanOptimizationText(suggestion.extras);
              if (cleaned) optimizations.push(cleaned);
            }
          }
        });
      }

      // Check for feasibilityAnalysis recommendations
      if (
        apiResponse.feasibilityAnalysis &&
        apiResponse.feasibilityAnalysis.recommendations
      ) {
        if (Array.isArray(apiResponse.feasibilityAnalysis.recommendations)) {
          apiResponse.feasibilityAnalysis.recommendations.forEach(
            (rec: any) => {
              if (typeof rec === "string") {
                const cleaned = cleanOptimizationText(rec);
                if (cleaned) optimizations.push(cleaned);
              }
            }
          );
        }
      }

      // Check for feasibilityAnalysis issues
      if (
        apiResponse.feasibilityAnalysis &&
        apiResponse.feasibilityAnalysis.issues
      ) {
        if (Array.isArray(apiResponse.feasibilityAnalysis.issues)) {
          apiResponse.feasibilityAnalysis.issues.forEach((issue: any) => {
            if (typeof issue === "string") {
              const cleaned = cleanOptimizationText(issue);
              if (cleaned) optimizations.push(cleaned);
            }
          });
        }
      }

      // Check for aiGeneratedDescription
      if (
        apiResponse.aiGeneratedDescription &&
        typeof apiResponse.aiGeneratedDescription === "string"
      ) {
        const cleaned = cleanOptimizationText(
          apiResponse.aiGeneratedDescription
        );
        if (cleaned) optimizations.push(cleaned);
      }

      // Remove duplicates and ensure all are strings
      const uniqueOptimizations = [
        ...new Set(
          optimizations.filter(
            (opt) => typeof opt === "string" && opt.length > 0
          )
        ),
      ];

      console.log("📋 Found optimizations:", uniqueOptimizations);

      // If no specific optimizations found, provide default options
      if (uniqueOptimizations.length === 0) {
        console.log("📋 No optimizations found, using default options");
        return [
          "Use standard materials instead of premium",
          "Reduce square footage by 10%",
          "Simplify roof design",
          "Use energy-efficient but standard windows",
          "Opt for basic landscaping",
          "Choose standard fixtures",
          "Reduce number of bathrooms",
          "Use prefabricated components",
        ];
      }

      return uniqueOptimizations;
    } catch (error) {
      console.error("❌ Error in getCostOptimizationOptions:", error);
      // Return default options on error
      return [
        "Use standard materials instead of premium",
        "Reduce square footage by 10%",
        "Simplify roof design",
        "Use energy-efficient but standard windows",
        "Opt for basic landscaping",
        "Choose standard fixtures",
        "Reduce number of bathrooms",
        "Use prefabricated components",
      ];
    }
  };

  const getOptimizationIcon = (optimization: string) => {
    const lowerOptimization = optimization.toLowerCase();

    // Material-related optimizations
    if (
      lowerOptimization.includes("material") ||
      lowerOptimization.includes("premium")
    ) {
      return (
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
          <path d="M3 3h18v18H3z" />
          <path d="M9 9h6v6H9z" />
        </svg>
      );
    }

    // Size-related optimizations
    if (
      lowerOptimization.includes("square footage") ||
      lowerOptimization.includes("size") ||
      lowerOptimization.includes("reduce")
    ) {
      return (
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
          <path d="M3 3h18v18H3z" />
          <path d="M9 9h6v6H9z" />
          <path d="M15 3v18" />
          <path d="M3 15h18" />
        </svg>
      );
    }

    // Roof-related optimizations
    if (lowerOptimization.includes("roof")) {
      return (
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
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    }

    // Window-related optimizations
    if (
      lowerOptimization.includes("window") ||
      lowerOptimization.includes("energy")
    ) {
      return (
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
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    }

    // Landscaping-related optimizations
    if (
      lowerOptimization.includes("landscap") ||
      lowerOptimization.includes("garden")
    ) {
      return (
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
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    }

    // Fixture-related optimizations
    if (
      lowerOptimization.includes("fixture") ||
      lowerOptimization.includes("bathroom")
    ) {
      return (
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
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="M4 8h16" />
          <path d="M8 12h8" />
        </svg>
      );
    }

    // Prefabricated components
    if (
      lowerOptimization.includes("prefabricated") ||
      lowerOptimization.includes("component")
    ) {
      return (
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
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 3v18" />
          <path d="M15 3v18" />
        </svg>
      );
    }

    // Default icon for other optimizations
    return (
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
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {!isClient ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Cost Optimization
            </h2>
            <p className="text-muted-foreground mt-2">
              Select cost optimization strategies to reduce your project cost.
            </p>
          </div>

          {/* 
            API Response Display Section - Cost Optimization
            =================================================
            
            This section displays the API response data specifically for cost optimization purposes.
            It shows the user the current estimation details and provides cost optimization options
            extracted from the API response. The section includes:
            
            - Current project description from previous steps
            - Estimated cost to establish baseline for optimization
            - Confidence level of the estimation (if available)
            - Feasibility analysis results (if available)
            - Live preview of updated description with current step selections
            
            The display uses an orange color scheme to indicate cost optimization focus
            and provides visual feedback for the optimization process.
            
            This section is active and visible to users to help them understand
            their current estimation and available cost-saving options.
          */}
          {/* API Response Display */}
          {formData.apiResponse && (
            <Card className="p-6 mb-6 bg-orange-50 border-orange-200">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-orange-800">
                  🎯 Cost Optimization Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-orange-700">
                      Current Description:
                    </span>
                    <p className="text-orange-600 mt-1">
                      {formData.apiResponse.description || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-orange-700">
                      Estimated Cost:
                    </span>
                    <p className="text-orange-600 mt-1">
                      $
                      {isClient && formData.apiResponse.estimatedCost
                        ? formData.apiResponse.estimatedCost.toLocaleString()
                        : formData.apiResponse.estimatedCost || "N/A"}
                    </p>
                  </div>
                  {formData.apiResponse.confidence && (
                    <div>
                      <span className="font-medium text-orange-700">
                        Confidence:
                      </span>
                      <p className="text-orange-600 mt-1 capitalize">
                        {formData.apiResponse.confidence}
                      </p>
                    </div>
                  )}
                  {formData.apiResponse.feasibilityAnalysis && (
                    <div>
                      <span className="font-medium text-orange-700">
                        Feasibility:
                      </span>
                      <p className="text-orange-600 mt-1">
                        {formData.apiResponse.feasibilityAnalysis.feasible
                          ? "Feasible"
                          : "Not Feasible"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Live Preview of Updated Description */}
                <div className="mt-4 p-4 bg-orange-100 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">
                    📝 Live Preview - Updated Description:
                  </h4>
                  <p className="text-orange-700 text-sm">
                    {generateLiveDescription()}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="p-6">
              <div className="space-y-8">
                {/* Cost Optimization Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium">
                    Cost Optimization Options
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Select cost optimization strategies from the API response to
                    reduce your project cost.
                  </p>
                  <div className="space-y-2 pt-2">
                    {getCostOptimizationOptions().map(
                      (optimization: string, index: number) => {
                        const optimizationKey = `optimization-${index}-${optimization.replace(
                          /[^a-zA-Z0-9]/g,
                          "-"
                        )}`;
                        const isSelected =
                          selectedCostOptimizations.includes(optimization);

                        return (
                          <div
                            key={optimizationKey}
                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group"
                          >
                            <input
                              type="checkbox"
                              id={optimizationKey}
                              checked={isSelected}
                              onChange={(e) => {
                                try {
                                  handleCostOptimizationChange(
                                    optimization,
                                    e.target.checked
                                  );
                                } catch (error) {
                                  console.error("❌ Error in onChange:", error);
                                }
                              }}
                              className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                            />

                            {/* Icon based on optimization type */}
                            <div className="flex-shrink-0 w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors">
                              {getOptimizationIcon(optimization)}
                            </div>

                            <Label
                              htmlFor={optimizationKey}
                              className="text-sm leading-tight cursor-pointer flex-1 group-hover:text-orange-700 transition-colors"
                            >
                              {optimization}
                            </Label>

                            {/* Selection indicator */}
                            <div className="flex-shrink-0">
                              {isSelected && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              <GenericButton
                type="button"
                onClick={prevStep}
                variant="outline"
                size="lg"
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
              <GenericButton type="submit" size="lg">
                Continue
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </GenericButton>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
}
