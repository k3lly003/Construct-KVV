"use client";

import React from 'react';
import { useFormContext } from '@/state/form-context';
import { StepOneBasics } from '@/app/(components)/build-house/form-steps/step-1-basics';
import { StepTwoExterior } from '@/app/(components)/build-house/form-steps/step-2-exterior';
import { StepThreeInterior } from '@/app/(components)/build-house/form-steps/step-3-interior';
import { StepFourOutdoor } from '@/app/(components)/build-house/form-steps/step-4-outdoor';
import { StepFivePreferences } from '@/app/(components)/build-house/form-steps/step-5-preferences';
import { StepSixContact } from '@/app/(components)/build-house/form-steps/step-6-contact';
import { FormSummary } from '@/app/(components)/build-house/form-summary';
import { StepIndicator } from '@/components/ui/step-indicator';
import { AnimatePresence } from 'framer-motion';

export function FormContainer() {
  const { currentStep, isFormCompleted } = useFormContext();

  const renderStep = () => {
    if (isFormCompleted) {
      return <FormSummary />;
    }

    switch (currentStep) {
      case 1:
        return <StepOneBasics />;
      case 2:
        return <StepTwoExterior />;
      case 3:
        return <StepThreeInterior />;
      case 4:
        return <StepFourOutdoor />;
      case 5:
        return <StepFivePreferences />;
      case 6:
        return <StepSixContact />;
      default:
        return <StepOneBasics />;
    }
  };

  if (isFormCompleted) {
    return renderStep();
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <StepIndicator className="mb-10" />
      
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}