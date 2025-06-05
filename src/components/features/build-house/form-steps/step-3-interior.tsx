"use client";

import { useFormContext } from "../../../../state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

export function StepThreeInterior() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleSpecialRoomChange = (room: string, checked: boolean) => {
    let newRooms = [...formData.specialRooms];
    
    if (checked) {
      newRooms.push(room);
    } else {
      newRooms = newRooms.filter(r => r !== room);
    }
    
    updateFormData({ specialRooms: newRooms });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Interior Features</h2>
        <p className="text-muted-foreground mt-2">
          Design the interior spaces and room layout of your dream home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="openFloorPlan" className="text-lg font-medium">Open Floor Plan</Label>
                  <p className="text-muted-foreground text-sm">
                    Spacious layout with minimal walls between living spaces.
                  </p>
                </div>
                <Switch 
                  id="openFloorPlan" 
                  checked={formData.openFloorPlan}
                  onCheckedChange={(checked) => updateFormData({ openFloorPlan: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Kitchen Style</Label>
              <RadioGroup 
                value={formData.kitchenStyle}
                onValueChange={(value) => updateFormData({ kitchenStyle: value })}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2"
              >
                {[
                  { id: "modern", label: "Modern", icon: "layout-dashboard" },
                  { id: "traditional", label: "Traditional", icon: "coffee" },
                  { id: "farmhouse", label: "Farmhouse", icon: "landmark" },
                  { id: "industrial", label: "Industrial", icon: "factory" },
                  { id: "minimalist", label: "Minimalist", icon: "square" },
                  { id: "luxury", label: "Luxury", icon: "gem" }
                ].map((style) => (
                  <Label
                    key={style.id}
                    htmlFor={`kitchen-${style.id}`}
                    className={`
                      flex items-center justify-between rounded-md border-2 cursor-pointer p-4
                      hover:bg-accent transition-colors duration-200
                      ${formData.kitchenStyle === style.id ? 'border-primary bg-accent' : 'border-input'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {getIconForStyle(style.icon)}
                      <div>{style.label}</div>
                    </div>
                    <RadioGroupItem value={style.id} id={`kitchen-${style.id}`} />
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-4 p-4 border rounded-md">
                <div>
                  <Label htmlFor="hasBasement" className="text-base font-medium">Basement</Label>
                  <p className="text-muted-foreground text-sm">Include a basement level</p>
                </div>
                <Switch 
                  id="hasBasement" 
                  checked={formData.hasBasement}
                  onCheckedChange={(checked) => updateFormData({ hasBasement: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-4 p-4 border rounded-md">
                <div>
                  <Label htmlFor="hasHomeOffice" className="text-base font-medium">Home Office</Label>
                  <p className="text-muted-foreground text-sm">Dedicated workspace</p>
                </div>
                <Switch 
                  id="hasHomeOffice" 
                  checked={formData.hasHomeOffice}
                  onCheckedChange={(checked) => updateFormData({ hasHomeOffice: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Special Rooms</Label>
              <p className="text-muted-foreground text-sm">
                Select any special purpose rooms you would like to include.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {[
                  { id: "gym", label: "Home Gym" },
                  { id: "theater", label: "Media Room" },
                  { id: "library", label: "Library" },
                  { id: "wine_cellar", label: "Wine Cellar" },
                  { id: "studio", label: "Art Studio" },
                  { id: "game_room", label: "Game Room" },
                  { id: "sunroom", label: "Sunroom" },
                  { id: "sauna", label: "Sauna/Spa" },
                  { id: "bar", label: "Bar Area" }
                ].map((room) => (
                  <div key={room.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/30 transition-colors">
                    <Checkbox 
                      id={`room-${room.id}`} 
                      checked={formData.specialRooms.includes(room.id)}
                      onCheckedChange={(checked) => 
                        handleSpecialRoomChange(room.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`room-${room.id}`}
                      className="text-base cursor-pointer flex-grow"
                    >
                      {room.label}
                    </Label>
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

function getIconForStyle(icon: string) {
  switch (icon) {
    case "layout-dashboard":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      );
    case "coffee":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
      );
    case "landmark":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
      );
    case "factory":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>
      );
    case "square":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
      );
    case "gem":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/><path d="m12 22 4-13-8-6"/><path d="M12 22 8 9l8-6"/><path d="M2 9h20"/></svg>
      );
    default:
      return null;
  }
}
