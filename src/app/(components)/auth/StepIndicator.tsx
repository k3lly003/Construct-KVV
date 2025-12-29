import React from 'react';
import { Check } from 'lucide-react';
// import { FormStep } from '../types';

interface FormStep {
    id: number;
    title: string;
    description: string;
}

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 transform ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 scale-110'
                    : isActive
                    ? 'bg-white border-emerald-600 border-4 scale-110 shadow-lg'
                    : 'bg-white border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span
                    className={`text-small font-bold transition-colors duration-300 ${
                      isActive ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </div>
              <div className="mt-3 text-center max-w-24">
                <p
                  className={`text-small font-semibold transition-colors duration-300 ${
                    isActive ? 'text-emerald-600' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
        
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 -z-10">
          <div
            className="h-full bg-emerald-600 transition-all duration-700 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};