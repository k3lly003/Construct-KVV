"use client";

import React, { createContext, useState, useContext, useCallback } from "react";
import { FormData, initialFormData } from "@/app/utils/fakes/formData";

type FormContextType = {
  formData: FormData;
  currentStep: number;
  updateFormData: (data: Partial<FormData>) => void;
  setApiResponse: (response: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  totalSteps: number;
  resetForm: () => void;
  completeForm: () => void;
  isFormCompleted: boolean;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const TOTAL_STEPS = 6;

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormCompleted, setIsFormCompleted] = useState(false);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => ({ ...prev, ...data }));
  }, []);

  const setApiResponse = useCallback((response: any) => {
    setFormData((prev) => ({ ...prev, apiResponse: response }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsFormCompleted(false);
  }, []);

  const completeForm = useCallback(() => {
    // Here you would typically submit the form data to your backend
    console.log("Form submitted:", formData);
    setIsFormCompleted(true);
  }, [formData]);

  const value = {
    formData,
    currentStep,
    updateFormData,
    setApiResponse,
    nextStep,
    prevStep,
    goToStep,
    isLastStep: currentStep === TOTAL_STEPS,
    isFirstStep: currentStep === 1,
    totalSteps: TOTAL_STEPS,
    resetForm,
    completeForm,
    isFormCompleted,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
