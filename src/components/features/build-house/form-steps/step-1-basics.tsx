"use client";

import { useFormContext } from "../../../../state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function StepOneBasics() {
  const { formData, updateFormData, nextStep } = useFormContext();

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
        <h2 className="text-title font-bold tracking-tight">Project Basics</h2>
        <p className="text-muted-foreground mt-2">
          Let us start with the fundamental details of your dream home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-base">Project Type</Label>
              <RadioGroup 
                id="projectType"
                value={formData.projectType}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(value: any) => updateFormData({ projectType: value })}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
              >
                <Label
                  htmlFor="residential"
                  className={`
                    flex items-center justify-center h-24 rounded-md border-2 cursor-pointer p-4 text-center
                    hover:bg-accent transition-colors duration-200
                    ${formData.projectType === 'residential' ? 'border-primary bg-accent' : 'border-input'}
                  `}
                >
                  <div>
                    <RadioGroupItem value="residential" id="residential" className="sr-only" />
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <div>Residential</div>
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="commercial"
                  className={`
                    flex items-center justify-center h-24 rounded-md border-2 cursor-pointer p-4 text-center
                    hover:bg-accent transition-colors duration-200
                    ${formData.projectType === 'commercial' ? 'border-primary bg-accent' : 'border-input'}
                  `}
                >
                  <div>
                    <RadioGroupItem value="commercial" id="commercial" className="sr-only" />
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                      <div>Commercial</div>
                    </div>
                  </div>
                </Label>
                <Label
                  htmlFor="mixed"
                  className={`
                    flex items-center justify-center h-24 rounded-md border-2 cursor-pointer p-4 text-center
                    hover:bg-accent transition-colors duration-200
                    ${formData.projectType === 'mixed' ? 'border-primary bg-accent' : 'border-input'}
                  `}
                >
                  <div>
                    <RadioGroupItem value="mixed" id="mixed" className="sr-only" />
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
                      <div>Mixed Use</div>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="squareFootage" className="text-base">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  min="500"
                  step="100"
                  value={formData.squareFootage}
                  onChange={(e) => updateFormData({ squareFootage: parseInt(e.target.value) || 0 })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stories" className="text-base">Number of Stories</Label>
                <Input
                  id="stories"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stories}
                  onChange={(e) => updateFormData({ stories: parseInt(e.target.value) || 0 })}
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-base">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.bedrooms}
                  onChange={(e) => updateFormData({ bedrooms: parseInt(e.target.value) || 0 })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-base">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => updateFormData({ bathrooms: parseFloat(e.target.value) || 0 })}
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-end">
          <GenericButton type="submit" size="lg">
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </GenericButton>
        </div>
      </form>
    </motion.div>
  );
}
