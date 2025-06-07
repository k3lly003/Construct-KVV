"use client";

import React from 'react';
import { useFormContext } from "@/state/form-context";
import { GenericButton } from "@/components/ui/generic-button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function FormSummary() {
  const { formData, resetForm } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-12"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Design Request Submitted!</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Thank you, {formData.name}. We have received your design preferences.
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Project Type</p>
                <p className="font-medium capitalize">{formData.projectType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Square Footage</p>
                <p className="font-medium">{formData.squareFootage} sq ft</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">House Style</p>
                <p className="font-medium capitalize">{formData.houseStyle.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Layout</p>
                <p className="font-medium">{formData.bedrooms} bed, {formData.bathrooms} bath, {formData.stories} story</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Timeline & Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Timeline</p>
                <p className="font-medium capitalize">{formData.timeline.replace(/_/g, ' ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Budget Range</p>
                <p className="font-medium capitalize">{formData.budget.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{formData.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-muted/40 p-6 rounded-md border mb-8">
        <h3 className="font-semibold mb-2">What happens next?</h3>
        <ol className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <span>Our design team will review your request within 24 hours.</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <span>You will receive AI-generated design concepts via email within 3-5 business days.</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <span>A design consultant will schedule a call to discuss your concepts and next steps.</span>
          </li>
        </ol>
      </div>

      <div className="text-center">
        <GenericButton 
          onClick={resetForm}
          variant="outline"
          size="lg"
        >
          Submit Another Design Request
        </GenericButton>
      </div>
    </motion.div>
  );
}
