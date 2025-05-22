"use client";

import { useFormContext } from "../../../../state/form-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageSelector } from "@/components/ui/image-selector";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { landscapeStyleOptions } from "../../../utils/fakes/formData";

export function StepFourOutdoor() {
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
        <h2 className="text-3xl font-bold tracking-tight">Outdoor Spaces</h2>
        <p className="text-muted-foreground mt-2">
          Design your outdoor environment to complement your home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Landscape Style</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Choose a landscaping approach that matches your aesthetic vision.
              </p>
              <ImageSelector 
                options={landscapeStyleOptions}
                value={formData.landscapeStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value) => updateFormData({ landscapeStyle: value as any })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-4 p-4 border rounded-md hover:bg-accent/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="10" height="10" x="7" y="7" rx="1" ry="1"/></svg>
                    <Label htmlFor="hasDeck" className="text-base font-medium cursor-pointer">Deck/Patio</Label>
                  </div>
                  <Switch 
                    id="hasDeck" 
                    checked={formData.hasDeck}
                    onCheckedChange={(checked) => updateFormData({ hasDeck: checked })}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  An outdoor lounging and entertainment area
                </p>
              </div>
              
              <div className="flex flex-col space-y-4 p-4 border rounded-md hover:bg-accent/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M4 22h16"/><path d="M10 22V2L8 4"/><path d="M14 22V2l2 2"/><path d="M4 10h6"/><path d="M14 10h6"/><path d="M4 14h16"/><path d="M4 18h16"/></svg>
                    <Label htmlFor="hasPool" className="text-base font-medium cursor-pointer">Swimming Pool</Label>
                  </div>
                  <Switch 
                    id="hasPool" 
                    checked={formData.hasPool}
                    onCheckedChange={(checked) => updateFormData({ hasPool: checked })}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  Private swimming area for recreation
                </p>
              </div>
              
              <div className="flex flex-col space-y-4 p-4 border rounded-md hover:bg-accent/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M15 14h.01"/><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M14 9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6h12v3Z"/></svg>
                    <Label htmlFor="hasOutdoorKitchen" className="text-base font-medium cursor-pointer">Outdoor Kitchen</Label>
                  </div>
                  <Switch 
                    id="hasOutdoorKitchen" 
                    checked={formData.hasOutdoorKitchen}
                    onCheckedChange={(checked) => updateFormData({ hasOutdoorKitchen: checked })}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  Outdoor cooking and dining space
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Label htmlFor="outdoorNotes" className="text-base font-medium">Additional Outdoor Features</Label>
              <Textarea
                id="outdoorNotes"
                placeholder="Describe any additional outdoor features you'd like, such as fire pits, gardens, water features, etc."
                className="min-h-[100px]"
                value={formData.outdoorNotes || ""}
                onChange={(e) => updateFormData({ outdoorNotes: e.target.value })}
              />
            </div>
          </div>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            onClick={prevStep}
            variant="outline"
            size="lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </Button>
          <Button type="submit" size="lg">
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Button>
        </div>
      </form>
    </motion.div>
  );
}