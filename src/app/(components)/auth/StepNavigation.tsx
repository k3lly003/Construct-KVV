import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canProceed: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  canProceed
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-8 border-t border-slate-200">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          currentStep === 1
            ? 'text-slate-400 cursor-not-allowed'
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
        }`}
      >
        <ArrowLeft size={20} />
        <span>Previous</span>
      </button>

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            canProceed && !isSubmitting
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            canProceed
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Next Step</span>
          <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
};