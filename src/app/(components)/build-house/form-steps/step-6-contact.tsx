/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import React from "react";

export function StepSixContact() {
  const { formData, updateFormData, prevStep, completeForm, isLastStep } = useFormContext();
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Almost Done!</h2>
        <p className="text-muted-foreground mt-2">
          Please provide your contact information so we can share your custom design.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                className="h-12"
              />
            </div>
            
            <div className="space-y-8 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex space-x-2 items-start">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                    required
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree to receive communications about my design request and understand that my information will be used in accordance with the privacy policy.
                  </Label>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">What happens next?</span> Our design team will review your preferences and create a custom visualization of your dream project. You will receive your personalized design concept within 3-5 business days.
                  </p>
                </div>
              </motion.div>
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
          <GenericButton 
            type="submit" 
            size="lg"
            disabled={!agreedToTerms}
          >
            Submit Design Request
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </GenericButton>
        </div>
      </form>
    </motion.div>
  );
}
