"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useFormContext } from '../../state/form-context';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  className?: string;
}

export function StepIndicator({ className }: StepIndicatorProps) {
  const { currentStep, totalSteps, goToStep } = useFormContext();
  
  // Step labels
  const stepLabels = [
    "Basics",
    "Exterior",
    "Interior",
    "Outdoor",
    "Summary",
    "Submission"
  ];

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Background progress bar */}
        <div className="absolute h-1 bg-muted w-full rounded-full" />
        
        {/* Animated progress bar */}
        <motion.div 
          className="absolute h-1 bg-primary rounded-full"
          initial={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Step indicators */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              {/* Step circle */}
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                    : isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                onClick={() => stepNum <= currentStep && goToStep(stepNum)}
                disabled={stepNum > currentStep}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ) : (
                  stepNum
                )}
              </button>
              
              {/* Step label */}
              <span 
                className={cn(
                  "text-small mt-2 font-medium hidden md:block",
                  isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stepLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}