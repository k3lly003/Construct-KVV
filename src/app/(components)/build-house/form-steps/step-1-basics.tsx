"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { useState } from "react";
import axios from "axios";

export function StepOneBasics() {
  const { formData, updateFormData, nextStep, setApiResponse } =
    useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("🏠 Step 1 - Basics Component Rendered");
  console.log("📊 Current Form Data:", formData);
  console.log("🔄 Loading State:", isLoading);
  console.log("❌ Error State:", error);

  // Additional state for new fields
  const [kitchensCount, setKitchensCount] = useState(1);
  const [conversationRoomsCount, setConversationRoomsCount] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(25000000);

  console.log("🍳 Kitchens Count:", kitchensCount);
  console.log("💬 Conversation Rooms Count:", conversationRoomsCount);
  console.log("💰 Estimated Cost:", estimatedCost);

  // Dynamic features state
  const [features, setFeatures] = useState([
    { name: "garage", count: 2, enabled: false },
    { name: "garden", count: 1, enabled: false },
    { name: "swimming_pool", count: 1, enabled: false },
    { name: "balcony", count: 1, enabled: false },
    { name: "basement", count: 1, enabled: false },
    { name: "attic", count: 1, enabled: false },
    { name: "home_office", count: 1, enabled: false },
    { name: "gym", count: 1, enabled: false },
    { name: "wine_cellar", count: 1, enabled: false },
    { name: "theater_room", count: 1, enabled: false },
    { name: "game_room", count: 1, enabled: false },
    { name: "library", count: 1, enabled: false },
    { name: "sauna", count: 1, enabled: false },
    { name: "jacuzzi", count: 1, enabled: false },
    { name: "fireplace", count: 1, enabled: false },
    { name: "elevator", count: 1, enabled: false },
    { name: "solar_panels", count: 1, enabled: false },
    { name: "security_system", count: 1, enabled: false },
    { name: "smart_home", count: 1, enabled: false },
    { name: "outdoor_kitchen", count: 1, enabled: false },
  ]);

  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureCount, setNewFeatureCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Step 1 - Form Submit Triggered");
    console.log("📝 Form Data at Submit:", {
      projectType: formData.projectType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      kitchensCount,
      conversationRoomsCount,
      estimatedCost,
      features: features.filter((f) => f.enabled),
    });

    // Perform API call before proceeding
    await handleApiCall();

    // Only proceed to next step if there's no error
    if (!error) {
      console.log("✅ Step 1 - Proceeding to next step");
      nextStep();
    } else {
      console.log("❌ Step 1 - Error occurred, staying on current step");
    }
  };

  const toggleFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].enabled = !updatedFeatures[index].enabled;
    setFeatures(updatedFeatures);
  };

  const updateFeatureCount = (index: number, count: number) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].count = count;
    setFeatures(updatedFeatures);
  };

  const addNewFeature = () => {
    if (newFeatureName.trim()) {
      setFeatures([
        ...features,
        {
          name: newFeatureName.trim().toLowerCase().replace(/\s+/g, "_"),
          count: newFeatureCount,
          enabled: true,
        },
      ]);
      setNewFeatureName("");
      setNewFeatureCount(1);
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const generateDescription = () => {
    console.log("📝 Step 1 - Generating Description");

    const parts = [];

    if (formData.bedrooms) {
      parts.push(`${formData.bedrooms}-bedroom`);
    }

    if (formData.projectType) {
      parts.push(formData.projectType);
    }

    const enabledFeatures = features.filter((f) => f.enabled);
    if (enabledFeatures.length > 0) {
      const featureDescriptions = enabledFeatures.map((f) => {
        if (f.count > 1) {
          return `${f.count} ${f.name.replace(/_/g, " ")}s`;
        }
        return f.name.replace(/_/g, " ");
      });
      parts.push(`with ${featureDescriptions.join(", ")}`);
    }

    parts.push("family home");

    const finalDescription = parts.join(" ") + " with open plan living";
    console.log("📝 Step 1 - Generated Description:", finalDescription);
    return finalDescription;
  };

  const handleApiCall = async () => {
    setIsLoading(true);
    setError(null);

    console.log("🚀formData ", formData);
    console.log(
      "🚀 getUserDataFromLocalStorage ",
      getUserDataFromLocalStorage()
    );
    const token = localStorage.getItem("authToken");
    console.log("🚀token from step-1-basics ", token);
    if (!token) {
      setError("No authentication token found. Please login first.");
      setIsLoading(false);
      return;
    }

    const enabledFeatures = features.filter((f) => f.enabled);
    const extras = enabledFeatures.map((feature) => ({
      name: feature.name,
      detail: { count: feature.count },
    }));

    const requestBody = {
      roomsCount: formData.bedrooms || 0,
      bathroomsCount: formData.bathrooms || 0,
      kitchensCount: kitchensCount,
      conversationRoomsCount: conversationRoomsCount,
      extras: extras,
      description: generateDescription(),
      estimatedCost: estimatedCost,
    };

    console.log("🚀authToken ", token);
    console.log("🚀 Sending API Request:", {
      url: "http://localhost:300/api/v1/estimator/comprehensive",
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    });

    console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/estimator/comprehensive",
        requestBody,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ API Response Status:", response.status);
      console.log("✅ API Response Headers:", response.headers);
      console.log("✅ API Response Data:", response.data);
      setApiResponse(response.data);
    } catch (error: any) {
      console.error("❌ API Error Status:", error.response?.status);
      console.error("❌ API Error Headers:", error.response?.headers);
      console.error("❌ API Error Data:", error.response?.data);
      console.error("❌ API Error Message:", error.message);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to get estimate"
      );
    } finally {
      setIsLoading(false);
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
        <h2 className="text-3xl font-bold tracking-tight">Project Basics</h2>
        <p className="text-muted-foreground mt-2">
          Let us start with the fundamental details of your dream home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-base">
                Project Type
              </Label>
              <RadioGroup
                id="projectType"
                value={formData.projectType}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(value: any) =>
                  updateFormData({ projectType: value })
                }
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
              >
                <Label
                  htmlFor="residential"
                  className={`
                    flex items-center justify-center h-24 rounded-md border-2 cursor-pointer p-4 text-center
                    hover:bg-accent transition-colors duration-200
                    ${
                      formData.projectType === "residential"
                        ? "border-primary bg-accent"
                        : "border-input"
                    }
                  `}
                >
                  <div>
                    <RadioGroupItem
                      value="residential"
                      id="residential"
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center">
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
                        className="mb-2"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <div>Residential</div>
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="commercial"
                  className={`
                    flex items-center justify-center h-24 rounded-md border-2 cursor-pointer p-4 text-center
                    hover:bg-accent transition-colors duration-200
                    ${
                      formData.projectType === "commercial"
                        ? "border-primary bg-accent"
                        : "border-input"
                    }
                  `}
                >
                  <div>
                    <RadioGroupItem
                      value="commercial"
                      id="commercial"
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center">
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
                        className="mb-2"
                      >
                        <rect
                          width="16"
                          height="20"
                          x="4"
                          y="2"
                          rx="2"
                          ry="2"
                        />
                        <path d="M9 22v-4h6v4" />
                        <path d="M8 6h.01" />
                        <path d="M16 6h.01" />
                        <path d="M12 6h.01" />
                        <path d="M12 10h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 10h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 10h.01" />
                        <path d="M8 14h.01" />
                      </svg>
                      <div>Commercial</div>
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="mixed"
                  className={`
                    flex items-center justify-center h-24 rounded-md border-2 cursor-pointer p-4 text-center
                    hover:bg-accent transition-colors duration-200
                    ${
                      formData.projectType === "mixed"
                        ? "border-primary bg-accent"
                        : "border-input"
                    }
                  `}
                >
                  <div>
                    <RadioGroupItem
                      value="mixed"
                      id="mixed"
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center">
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
                        className="mb-2"
                      >
                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                        <path d="M12 3v6" />
                      </svg>
                      <div>Mixed Use</div>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-base">
                  Bedrooms (roomsCount)
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    updateFormData({ bedrooms: parseInt(e.target.value) || 0 })
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-base">
                  Bathrooms (bathroomsCount)
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    updateFormData({
                      bathrooms: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="kitchensCount" className="text-base">
                  Kitchens Count
                </Label>
                <Input
                  id="kitchensCount"
                  type="number"
                  min="1"
                  max="10"
                  value={kitchensCount}
                  onChange={(e) =>
                    setKitchensCount(parseInt(e.target.value) || 1)
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conversationRoomsCount" className="text-base">
                  Conversation Rooms Count
                </Label>
                <Input
                  id="conversationRoomsCount"
                  type="number"
                  min="0"
                  max="10"
                  value={conversationRoomsCount}
                  onChange={(e) =>
                    setConversationRoomsCount(parseInt(e.target.value) || 0)
                  }
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost" className="text-base">
                Estimated Cost
              </Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                step="1000"
                value={estimatedCost}
                onChange={(e) =>
                  setEstimatedCost(parseInt(e.target.value) || 0)
                }
                className="h-12"
                placeholder="Enter estimated cost"
              />
            </div>

            {/* Dynamic Features Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold">Additional Features</h3>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`feature-${index}`}
                        checked={feature.enabled}
                        onChange={() => toggleFeature(index)}
                        className="w-4 h-4 text-primary"
                      />
                      <Label
                        htmlFor={`feature-${index}`}
                        className="text-base cursor-pointer capitalize"
                      >
                        {feature.name.replace(/_/g, " ")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {feature.enabled && (
                        <>
                          <Label className="text-sm">Count:</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={feature.count}
                            onChange={(e) =>
                              updateFeatureCount(
                                index,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 h-8"
                          />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-destructive hover:text-destructive/80 p-1"
                      >
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
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Feature */}
              <div className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Add Custom Feature</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Feature name (e.g., rooftop terrace)"
                      value={newFeatureName}
                      onChange={(e) => setNewFeatureName(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newFeatureCount}
                      onChange={(e) =>
                        setNewFeatureCount(parseInt(e.target.value) || 1)
                      }
                      className="h-10"
                      placeholder="Count"
                    />
                  </div>
                  <GenericButton
                    type="button"
                    onClick={addNewFeature}
                    disabled={!newFeatureName.trim()}
                    size="sm"
                    variant="outline"
                  >
                    Add
                  </GenericButton>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-3">
                Generated Description
              </h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {generateDescription()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <GenericButton type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue"}
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
