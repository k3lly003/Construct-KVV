/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageSelector } from "@/components/ui/image-selector";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  houseStyleOptions,
  roofStyleOptions,
  exteriorMaterialOptions,
} from "../../../utils/fakes/formData";

export function StepTwoExterior() {
  const { formData, updateFormData, nextStep, prevStep, setApiResponse } =
    useFormContext();

  console.log("🏗️ Step 2 - Exterior Component Rendered");
  console.log("📊 Current Form Data:", formData);
  console.log("🎨 Exterior Selections:", {
    houseStyle: formData.houseStyle,
    roofStyle: formData.roofStyle,
    exteriorMaterial: formData.exteriorMaterial,
    colorPalette: formData.colorPalette,
    hasGarage: formData.hasGarage,
    garageSize: formData.garageSize,
  });
  console.log("📡 API Response Available:", !!formData.apiResponse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Step 2 - Form Submit Triggered");
    console.log("🎨 Exterior Selections at Submit:", {
      houseStyle: formData.houseStyle,
      roofStyle: formData.roofStyle,
      exteriorMaterial: formData.exteriorMaterial,
      colorPalette: formData.colorPalette,
      hasGarage: formData.hasGarage,
      garageSize: formData.garageSize,
    });

    updateDescriptionWithStep2Selections();
    console.log("✅ Step 2 - Proceeding to next step");
    nextStep();
  };

  const updateDescriptionWithStep2Selections = () => {
    console.log("📝 Step 2 - Updating Description with Exterior Selections");
    
    if (!formData.apiResponse) {
      console.log("⚠ep 2 - No API response available for description update");
      return;
    }

    const baseDescription = formData
      .apiResponse.description || "";
    console.log("📝 Step 2 - Base Description:", baseDescription);

    // Build step 2 additions
    const step2Additions = [];

    if (formData.houseStyle) {
      step2Additions.push(`${formData.houseStyle} style`);
    }

    if (formData.roofStyle) {
      step2Additions.push(`${formData.roofStyle} roof`);
    }

    if (formData.exteriorMaterial) {
      step2Additions.push(`${formData.exteriorMaterial} exterior`);
    }

    if (formData.colorPalette) {
      step2Additions.push(`${formData.colorPalette} color palette`);
    }

    console.log("🎨 Step 2 - Exterior Additions:", step2Additions);

    // Create meaningful sentence
    let step2Description = "";
    if (step2Additions.length > 0) {
      step2Description = ` featuring ${step2Additions.join(", ")}`;
    }

    // Combine base description with step 2 additions
    const updatedDescription = baseDescription + step2Description;
    console.log("📝 Step 2 - Updated Description:", updatedDescription);

    // Update the API response with the new description
    const updatedApiResponse = {
      ...formData.apiResponse,
      description: updatedDescription,
      step2Selections: {
        houseStyle: formData.houseStyle,
        roofStyle: formData.roofStyle,
        exteriorMaterial: formData.exteriorMaterial,
        colorPalette: formData.colorPalette,
      },
    };

    console.log("🔄 Step 2 - Updated API Response:", updatedApiResponse);
    setApiResponse(updatedApiResponse);
  };

  const generateLiveDescription = () => {
    if (!formData.apiResponse) return "No API response available";

    const baseDescription = formData.apiResponse.description || "";

    // Build step 2 additions
    const step2Additions = [];

    if (formData.houseStyle) {
      step2Additions.push(`${formData.houseStyle} style`);
    }

    if (formData.roofStyle) {
      step2Additions.push(`${formData.roofStyle} roof`);
    }

    if (formData.exteriorMaterial) {
      step2Additions.push(`${formData.exteriorMaterial} exterior`);
    }

    if (formData.colorPalette) {
      step2Additions.push(`${formData.colorPalette} color palette`);
    }

    // Create meaningful sentence
    let step2Description = "";
    if (step2Additions.length > 0) {
      step2Description = ` featuring ${step2Additions.join(", ")}`;
    }

    return baseDescription + step2Description;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Exterior Design</h2>
        <p className="text-muted-foreground mt-2">
          Choose the exterior style and features that match your vision.
        </p>
      </div>

      {/* 
        API Response Display Section
        ============================
        
        This section displays the comprehensive API response data received from the estimator endpoint.
        It shows the user the results of their house estimation including:
        
        - Original project description from step 1
        - Estimated cost breakdown
        - Room and bathroom counts
        - Live preview of updated description with current step selections
        - Raw API response data for debugging purposes
        
        The display uses a green color scheme to indicate successful API response
        and provides visual feedback that the estimation process is working correctly.
        
        Note: This section is currently commented out but can be uncommented
        for debugging or to show users their estimation progress.
      */}
      {/* API Response Display */}
      {formData.apiResponse && (
        <Card className="p-6 mb-6 bg-green-50 border-green-200">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-green-800">
              🎉 Estimate Generated Successfully!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">
                  Original Description:
                </span>
                <p className="text-green-600 mt-1">
                  {formData.apiResponse.description || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-green-700">
                  Estimated Cost:
                </span>
                <p className="text-green-600 mt-1">
                  $
                  {formData.apiResponse.estimatedCost?.toLocaleString() ||
                    "N/A"}
                </p>
              </div>
              {formData.apiResponse.roomsCount && (
                <div>
                  <span className="font-medium text-green-700">Rooms:</span>
                  <p className="text-green-600 mt-1">
                    {formData.apiResponse.roomsCount} bedrooms
                  </p>
                </div>
              )}
              {formData.apiResponse.bathroomsCount && (
                <div>
                  <span className="font-medium text-green-700">Bathrooms:</span>
                  <p className="text-green-600 mt-1">
                    {formData.apiResponse.bathroomsCount} bathrooms
                  </p>
                </div>
              )}
            </div>

            {/* Live Preview of Updated Description */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">
                📝 Live Preview - Updated Description:
              </h4>
              <p className="text-blue-700 text-sm">
                {generateLiveDescription()}
              </p>
            </div>

            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <span className="font-medium text-green-700">
                API Response Data:
              </span>
              <pre className="text-xs text-green-600 mt-2 overflow-auto">
                {JSON.stringify(formData.apiResponse, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-medium">House Style</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Choose the architectural style that best represents your vision.
              </p>
              <ImageSelector
                options={houseStyleOptions}
                value={formData.houseStyle}
                onChange={(value) =>
                  updateFormData({ houseStyle: value as any })
                }
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Roof Style</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Select the roof design for your building.
              </p>
              <ImageSelector
                options={roofStyleOptions}
                value={formData.roofStyle}
                onChange={(value) =>
                  updateFormData({ roofStyle: value as any })
                }
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Exterior Material</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Choose the primary material for your building is exterior.
              </p>
              <ImageSelector
                options={exteriorMaterialOptions}
                value={formData.exteriorMaterial}
                onChange={(value) =>
                  updateFormData({ exteriorMaterial: value as any })
                }
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Color Palette</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Select a color scheme for your exterior design.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "neutral",
                  "warm",
                  "cool",
                  "earthy",
                  "vibrant",
                  "monochrome",
                  "custom",
                ].map((color) => (
                  <div
                    key={color}
                    className={`
                      relative cursor-pointer rounded-lg border-2 p-4 h-24
                      transition-all duration-200 transform hover:shadow-md
                      ${
                        formData.colorPalette === color
                          ? "border-primary"
                          : "border-border hover:border-muted-foreground/50"
                      }
                    `}
                    onClick={() =>
                      updateFormData({ colorPalette: color as any })
                    }
                  >
                    <div className="h-full flex flex-col justify-center items-center">
                      <div
                        className={`w-full h-4 rounded mb-2 ${getColorClass(
                          color
                        )}`}
                      ></div>
                      <span className="capitalize">
                        {color.replace("_", " ")}
                      </span>
                    </div>
                    {formData.colorPalette === color && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
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
                          className="lucide lucide-check"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
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
    </motion.div>
  );
}

function getColorClass(color: string): string {
  switch (color) {
    case "neutral":
      return "bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600";
    case "warm":
      return "bg-gradient-to-r from-amber-200 via-orange-400 to-red-600";
    case "cool":
      return "bg-gradient-to-r from-cyan-200 via-blue-400 to-indigo-600";
    case "earthy":
      return "bg-gradient-to-r from-stone-200 via-amber-600 to-emerald-800";
    case "vibrant":
      return "bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600";
    case "monochrome":
      return "bg-gradient-to-r from-gray-100 via-gray-500 to-gray-900";
    case "custom":
      return "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500";
    default:
      return "bg-gray-200";
  }
}
