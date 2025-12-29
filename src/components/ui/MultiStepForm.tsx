"use client";
import { useState } from "react";

interface Step {
  title: string;
  options: string[];
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: Record<string, string[]>) => void;
}

export default function MultiStepForm({
  steps,
  onComplete,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string[]>>({});

  const step = steps[currentStep];

  const handleCheckboxChange = (option: string) => {
    setFormData((prev) => {
      const selected = prev[step.title] || [];
      if (selected.includes(option)) {
        return { ...prev, [step.title]: selected.filter((o) => o !== option) };
      } else {
        return { ...prev, [step.title]: [...selected, option] };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-mid font-semibold mb-4">{step.title}</h2>

      <div className="space-y-3 mb-6">
        {step.options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={formData[step.title]?.includes(option) || false}
              onChange={() => handleCheckboxChange(option)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
