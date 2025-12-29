"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { useState } from "react";

export function StepFivePreferences() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  console.log("📋 Step 5 - Preferences Component Rendered");
  console.log("📊 Current Form Data:", formData);
  console.log("📅 Timeline Selection:", formData.timeline);
  console.log("✅ Agreement Status:", agreedToTerms);
  console.log("📡 API Response Available:", !!formData.apiResponse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Step 5 - Form Submit Triggered");
    console.log("📅 Timeline at Submit:", formData.timeline);
    console.log("✅ Agreement at Submit:", agreedToTerms);

    if (agreedToTerms) {
      // Store the complete house summary with timeline for use in step 6
      const completeSummary = {
        sections: houseSummary,
        timeline: formData.timeline,
        fullDescription: generateCompleteDescription(),
      };

      console.log("📋 Step 5 - Complete Summary Generated:", completeSummary);

      updateFormData({
        houseSummary: completeSummary,
        timeline: formData.timeline,
      });

      console.log("✅ Step 5 - Proceeding to next step");
      nextStep();
    } else {
      console.log("❌ Step 5 - Agreement not checked, staying on current step");
    }
  };

  // Generate comprehensive house description from all steps
  const generateHouseSummary = () => {
    const sections = [];

    // Step 1: Basic Info
    if (formData.projectType || formData.bedrooms || formData.bathrooms) {
      const basicInfo = [];
      if (formData.projectType)
        basicInfo.push(`${formData.projectType} project`);
      if (formData.bedrooms) basicInfo.push(`${formData.bedrooms} bedrooms`);
      if (formData.bathrooms) basicInfo.push(`${formData.bathrooms} bathrooms`);
      if (formData.squareFootage)
        basicInfo.push(`${formData.squareFootage} sq ft`);
      if (formData.stories) basicInfo.push(`${formData.stories} stories`);

      if (basicInfo.length > 0) {
        sections.push({
          title: "🏠 Basic Information",
          content: basicInfo.join(", "),
        });
      }
    }

    // Step 2: Exterior Features
    const exteriorFeatures = [];
    if (formData.houseStyle)
      exteriorFeatures.push(`${formData.houseStyle} style`);
    if (formData.roofStyle) exteriorFeatures.push(`${formData.roofStyle} roof`);
    if (formData.exteriorMaterial)
      exteriorFeatures.push(`${formData.exteriorMaterial} exterior`);
    if (formData.colorPalette)
      exteriorFeatures.push(`${formData.colorPalette} color palette`);
    if (formData.hasGarage) {
      const garageText = formData.garageSize
        ? `${formData.garageSize}-car garage`
        : "garage";
      exteriorFeatures.push(garageText);
    }

    if (exteriorFeatures.length > 0) {
      sections.push({
        title: "🏗️ Exterior Design",
        content: exteriorFeatures.join(", "),
      });
    }

    // Step 3: Interior Features
    const interiorFeatures = [];
    if (formData.openFloorPlan) interiorFeatures.push("open floor plan");
    if (formData.kitchenStyle)
      interiorFeatures.push(`${formData.kitchenStyle} kitchen`);
    if (formData.hasBasement) interiorFeatures.push("basement");
    if (formData.hasHomeOffice) interiorFeatures.push("home office");
    if (formData.specialRooms && formData.specialRooms.length > 0) {
      interiorFeatures.push(
        `special rooms: ${formData.specialRooms.join(", ")}`
      );
    }

    if (interiorFeatures.length > 0) {
      sections.push({
        title: "🏠 Interior Features",
        content: interiorFeatures.join(", "),
      });
    }

    // Step 4: Outdoor Features
    const outdoorFeatures = [];
    if (formData.landscapeStyle)
      outdoorFeatures.push(`${formData.landscapeStyle} landscaping`);
    if (formData.hasDeck) outdoorFeatures.push("deck");
    if (formData.hasPool) outdoorFeatures.push("swimming pool");
    if (formData.hasOutdoorKitchen) outdoorFeatures.push("outdoor kitchen");
    if (formData.outdoorNotes)
      outdoorFeatures.push(`notes: ${formData.outdoorNotes}`);

    if (outdoorFeatures.length > 0) {
      sections.push({
        title: "🌳 Outdoor Features",
        content: outdoorFeatures.join(", "),
      });
    }

    // API Response Description (if available)
    if (formData.apiResponse && formData.apiResponse.description) {
      sections.push({
        title: "📋 AI Generated Description",
        content: formData.apiResponse.description,
      });
    }

    return sections;
  };

  const houseSummary = generateHouseSummary();

  // Generate a complete description combining all sections
  const generateCompleteDescription = () => {
    console.log("📝 Step 5 - Generating Complete Description");

    const descriptionParts = [];

    // Add basic information
    if (formData.projectType || formData.bedrooms || formData.bathrooms) {
      const basicInfo = [];
      if (formData.projectType)
        basicInfo.push(`${formData.projectType} project`);
      if (formData.bedrooms) basicInfo.push(`${formData.bedrooms} bedrooms`);
      if (formData.bathrooms) basicInfo.push(`${formData.bathrooms} bathrooms`);
      if (formData.squareFootage)
        basicInfo.push(`${formData.squareFootage} sq ft`);
      if (formData.stories) basicInfo.push(`${formData.stories} stories`);

      if (basicInfo.length > 0) {
        descriptionParts.push(
          `This stunning ${basicInfo.join(
            ", "
          )} offers the perfect blend of modern comfort and urban sophistication.`
        );
      }
    }

    console.log("🏠 Step 5 - Basic Info Description Parts:", descriptionParts);

    // Add exterior features
    const exteriorFeatures = [];
    if (formData.houseStyle)
      exteriorFeatures.push(`${formData.houseStyle} style`);
    if (formData.roofStyle) exteriorFeatures.push(`${formData.roofStyle} roof`);
    if (formData.exteriorMaterial)
      exteriorFeatures.push(`${formData.exteriorMaterial} exterior`);
    if (formData.colorPalette)
      exteriorFeatures.push(`${formData.colorPalette} color palette`);
    if (formData.hasGarage) {
      const garageText = formData.garageSize
        ? `${formData.garageSize}-car garage`
        : "garage";
      exteriorFeatures.push(garageText);
    }

    if (exteriorFeatures.length > 0) {
      descriptionParts.push(
        `Thoughtfully designed with ${exteriorFeatures.join(
          ", "
        )}, the home features functionality and aesthetics in mind.`
      );
    }

    console.log("🏗️ Step 5 - Exterior Features:", exteriorFeatures);

    // Add interior features
    const interiorFeatures = [];
    if (formData.openFloorPlan) interiorFeatures.push("open floor plan");
    if (formData.kitchenStyle)
      interiorFeatures.push(`${formData.kitchenStyle} kitchen`);
    if (formData.hasBasement) interiorFeatures.push("basement");
    if (formData.hasHomeOffice) interiorFeatures.push("home office");
    if (formData.specialRooms && formData.specialRooms.length > 0) {
      interiorFeatures.push(
        `special rooms: ${formData.specialRooms.join(", ")}`
      );
    }

    if (interiorFeatures.length > 0) {
      descriptionParts.push(
        `The interior includes ${interiorFeatures.join(
          ", "
        )}, each offering ample natural light and privacy—ideal for families or professionals seeking a serene living space.`
      );
    }

    console.log("🛋️ Step 5 - Interior Features:", interiorFeatures);

    // Add outdoor features
    const outdoorFeatures = [];
    if (formData.landscapeStyle)
      outdoorFeatures.push(`${formData.landscapeStyle} landscaping`);
    if (formData.hasDeck) outdoorFeatures.push("deck");
    if (formData.hasPool) outdoorFeatures.push("swimming pool");
    if (formData.hasOutdoorKitchen) outdoorFeatures.push("outdoor kitchen");

    if (outdoorFeatures.length > 0) {
      descriptionParts.push(
        `The outdoor space features ${outdoorFeatures.join(
          ", "
        )}, creating a perfect environment for relaxation and entertainment.`
      );
    }

    console.log("🌳 Step 5 - Outdoor Features:", outdoorFeatures);

    // Add timeline information
    if (formData.timeline) {
      const timelineText = getTimelineText(formData.timeline);
      descriptionParts.push(
        `This project is planned to start ${timelineText}.`
      );
    }

    console.log(
      "📅 Step 5 - Timeline Text:",
      formData.timeline ? getTimelineText(formData.timeline) : "None"
    );

    const finalDescription = descriptionParts.join(" ");
    console.log("📝 Step 5 - Final Complete Description:", finalDescription);
    return finalDescription;
  };

  // Helper function to get timeline text
  const getTimelineText = (timeline: string) => {
    switch (timeline) {
      case "immediate":
        return "immediately";
      case "within_3_months":
        return "within 3 months";
      case "3_6_months":
        return "in 3-6 months";
      case "6_12_months":
        return "in 6-12 months";
      default:
        return "as soon as possible";
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
        <h2 className="text-title font-bold tracking-tight">Project Summary</h2>
        <p className="text-muted-foreground mt-2">
          Review your complete house design and confirm your preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* House Summary Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-mid font-semibold text-primary mb-2">
                🏡 Your Dream House Summary
              </h3>
              <p className="text-muted-foreground">
                Here&apos;s a complete overview of your house design based on
                all your selections
              </p>
            </div>

            {/* Summary Sections */}
            <div className="space-y-4">
              {houseSummary.map((section, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                >
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    {section.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-8 p-6 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50/30">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="agreement"
                    className="text-base font-medium text-gray-800 cursor-pointer"
                  >
                    I agree to the project specifications
                  </Label>
                  <p className="text-small text-gray-600 mt-1">
                    By checking this box, I confirm that I have reviewed all the
                    house specifications above and agree to proceed with this
                    design. I understand that this summary represents my
                    complete house design preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget and Timeline Section */}
        <Card className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-mid font-medium">Timeline</Label>
              <RadioGroup
                value={formData.timeline}
                onValueChange={(value) => updateFormData({ timeline: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
              >
                {[
                  { value: "immediate", label: "Ready to start immediately" },
                  { value: "within_3_months", label: "Within 3 months" },
                  { value: "3_6_months", label: "3-6 months from now" },
                  { value: "6_12_months", label: "6-12 months from now" },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`timeline-${option.value}`}
                    className={`
                      flex items-center justify-between rounded-md border-2 cursor-pointer p-4
                      hover:bg-accent transition-colors duration-200
                      ${
                        formData.timeline === option.value
                          ? "border-primary bg-accent"
                          : "border-input"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    <RadioGroupItem
                      value={option.value}
                      id={`timeline-${option.value}`}
                    />
                  </Label>
                ))}
              </RadioGroup>
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
          <GenericButton
            type="submit"
            size="lg"
            disabled={!agreedToTerms}
            className={!agreedToTerms ? "opacity-50 cursor-not-allowed" : ""}
          >
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
