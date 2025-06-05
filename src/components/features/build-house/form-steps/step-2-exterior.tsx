/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormContext } from "../../../../state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageSelector } from "@/components/ui/image-selector";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  houseStyleOptions, 
  roofStyleOptions, 
  exteriorMaterialOptions 
} from "../../../utils/fakes/formData";

export function StepTwoExterior() {
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
        <h2 className="text-3xl font-bold tracking-tight">Exterior Design</h2>
        <p className="text-muted-foreground mt-2">
          Choose the exterior style and features that match your vision.
        </p>
      </div>

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
                onChange={(value) => updateFormData({ houseStyle: value as any })}
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
                onChange={(value) => updateFormData({ roofStyle: value as any })}
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
                onChange={(value) => updateFormData({ exteriorMaterial: value as any })}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Color Palette</Label>
              <p className="text-muted-foreground text-sm mb-4">
                Select a color scheme for your exterior design.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {["neutral", "warm", "cool", "earthy", "vibrant", "monochrome", "custom"].map((color) => (
                  <div
                    key={color}
                    className={`
                      relative cursor-pointer rounded-lg border-2 p-4 h-24
                      transition-all duration-200 transform hover:shadow-md
                      ${formData.colorPalette === color ? 'border-primary' : 'border-border hover:border-muted-foreground/50'}
                    `}
                    onClick={() => updateFormData({ colorPalette: color as any })}
                  >
                    <div className="h-full flex flex-col justify-center items-center">
                      <div className={`w-full h-4 rounded mb-2 ${getColorClass(color)}`}></div>
                      <span className="capitalize">{color.replace("_", " ")}</span>
                    </div>
                    {formData.colorPalette === color && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Switch 
                id="hasGarage" 
                checked={formData.hasGarage}
                onCheckedChange={(checked) => updateFormData({ hasGarage: checked })}
              />
              <Label htmlFor="hasGarage" className="text-base cursor-pointer">Include a garage</Label>
              
              {formData.hasGarage && (
                <div className="ml-auto w-32">
                  <Select
                    value={formData.garageSize?.toString() || "2"}
                    onValueChange={(value) => updateFormData({ garageSize: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Car capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1-Car</SelectItem>
                      <SelectItem value="2">2-Car</SelectItem>
                      <SelectItem value="3">3-Car</SelectItem>
                      <SelectItem value="4">4+ Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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

function getColorClass(color: string): string {
  switch (color) {
    case "neutral": return "bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600";
    case "warm": return "bg-gradient-to-r from-amber-200 via-orange-400 to-red-600";
    case "cool": return "bg-gradient-to-r from-cyan-200 via-blue-400 to-indigo-600";
    case "earthy": return "bg-gradient-to-r from-stone-200 via-amber-600 to-emerald-800";
    case "vibrant": return "bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600";
    case "monochrome": return "bg-gradient-to-r from-gray-100 via-gray-500 to-gray-900";
    case "custom": return "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500";
    default: return "bg-gray-200";
  }
}
