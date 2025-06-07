"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function StepFivePreferences() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Design Preferences</h2>
        <p className="text-muted-foreground mt-2">
          Share your inspiration and specific requirements for your project.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Inspiration URLs</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Add links to images or designs that inspire you (optional).
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Inspiration URL ${index + 1}`}
                      value={formData.inspirationImages[index] || ""}
                      onChange={(e) => {
                        const newImages = [...formData.inspirationImages];
                        newImages[index] = e.target.value;
                        updateFormData({ inspirationImages: newImages });
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="specificRequirements" className="text-lg font-medium">Specific Requirements</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Describe any specific features, requirements, or preferences not covered in previous steps.
              </p>
              <Textarea
                id="specificRequirements"
                placeholder="Please include any additional details about your design vision..."
                className="min-h-[150px]"
                value={formData.specificRequirements}
                onChange={(e) => updateFormData({ specificRequirements: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Budget Range (optional!)</Label>
              <RadioGroup 
                value={formData.budget}
                onValueChange={(value) => updateFormData({ budget: value })}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2"
              >
                {[
                  { value: "Above_100m Rfw", label: "Above_100m Rfw" },
                  { value: "under_100m Rfw", label: "under_100m Rfw" },
                  { value: "50m Rfw - 90m Rfw", label: "50m Rfw - 90m Rfw" },
                  { value: "10m Rfw - 25m Rfw", label: "10m Rfw - 25m Rfw" },
                  { value: "5m Rfw - 9.5m Rfw", label: "5m Rfw - 9.5m Rfw" },
                  { value: "above_1m Rfw", label: "above_1m Rfw" }
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`budget-${option.value}`}
                    className={`
                      flex items-center justify-between rounded-md border-2 cursor-pointer p-4
                      hover:bg-accent transition-colors duration-200
                      ${formData.budget === option.value ? 'border-primary bg-accent' : 'border-input'}
                    `}
                  >
                    <span>{option.label}</span>
                    <RadioGroupItem value={option.value} id={`budget-${option.value}`} />
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Timeline</Label>
              <RadioGroup 
                value={formData.timeline}
                onValueChange={(value) => updateFormData({ timeline: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
              >
                {[
                  { value: "immediate", label: "Ready to start immediately" },
                  { value: "within_3_months", label: "Within 3 months" },
                  { value: "3_6_months", label: "3-6 months from now" },
                  { value: "6_12_months", label: "6-12 months from now" }
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`timeline-${option.value}`}
                    className={`
                      flex items-center justify-between rounded-md border-2 cursor-pointer p-4
                      hover:bg-accent transition-colors duration-200
                      ${formData.timeline === option.value ? 'border-primary bg-accent' : 'border-input'}
                    `}
                  >
                    <span>{option.label}</span>
                    <RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </GenericButton>
          <GenericButton type="submit" size="lg">
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </GenericButton>
        </div>
      </form>
    </motion.div>
  );
}
