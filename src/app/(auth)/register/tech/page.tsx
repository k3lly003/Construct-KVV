'use client'

import React, { useState } from 'react';
import { Wrench, Shield, Star } from 'lucide-react';
import { categoryOptions } from '@/app/utils/fakes/categories';
import { ProgressBar } from '@/app/(components)/auth/ProgressBar';
import { StepIndicator } from '@/app/(components)/auth/StepIndicator';
import { FormInput } from '@/app/(components)/auth/FormInput';
import { CategorySelector } from '@/app/(components)/auth/CategorySelector';
import { LocationSelector } from '@/app/(components)/auth/LocationSelector';
import { FileUpload } from '@/app/(components)/auth/FileUpload';
import { StepNavigation } from '@/app/(components)/auth/StepNavigation';
import { SuccessModal } from '@/app/(components)/auth/SuccessModal';
import { useFormValidation } from '@/app/hooks/useArchFormValidation';


export interface FormStep {
  id: number;
  title: string;
  description: string;
}

export interface TechnicianFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  categories: string[];
  province: string;
  district: string;
  cell: string;
  experience: string;
  documents: File[];
}

const steps: FormStep[] = [
  { id: 1, title: 'Personal Info', description: 'Basic information and account setup' },
  { id: 2, title: 'Expertise', description: 'Select your professional categories' },
  { id: 3, title: 'Location', description: 'Service area and experience' },
  { id: 4, title: 'Documents', description: 'Upload certificates and documents' }
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<TechnicianFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    categories: [],
    province: '',
    district: '',
    cell: '',
    experience: '',
    documents: []
  });

  const { errors, isCurrentStepValid, validateCurrentStep } = useFormValidation(formData, currentStep);

  const updateFormData = (field: keyof TechnicianFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  const canProceed = isCurrentStepValid;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-mid font-bold text-slate-800 mb-2">Personal Information</h2>
              <p className="text-slate-600">Let's start with your basic details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                value={formData.firstName}
                onChange={(value) => updateFormData('firstName', value)}
                placeholder="Enter your first name"
                required
                error={errors.firstName}
              />
              <FormInput
                label="Last Name"
                value={formData.lastName}
                onChange={(value) => updateFormData('lastName', value)}
                placeholder="Enter your last name"
                required
                error={errors.lastName}
              />
            </div>

            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => updateFormData('email', value)}
              placeholder="your.email@example.com"
              required
              error={errors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => updateFormData('password', value)}
                placeholder="Create a strong password"
                required
                error={errors.password}
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />
              <FormInput
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => updateFormData('confirmPassword', value)}
                placeholder="Confirm your password"
                required
                error={errors.confirmPassword}
                showPasswordToggle
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                showPassword={showConfirmPassword}
              />
            </div>

            <FormInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(value) => updateFormData('phoneNumber', value)}
              placeholder="078XXXXXXX"
              required
              error={errors.phoneNumber}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <CategorySelector
              categories={categoryOptions}
              selectedCategories={formData.categories}
              onChange={(categories) => updateFormData('categories', categories)}
            />
            {errors.categories && (
              <p className="text-small text-red-600 font-medium">
                {errors.categories}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <LocationSelector
              province={formData.province}
              district={formData.district}
              cell={formData.cell}
              onProvinceChange={(province) => updateFormData('province', province)}
              onDistrictChange={(district) => updateFormData('district', district)}
              onCellChange={(cell) => updateFormData('cell', cell)}
            />

            <div className="space-y-2">
              <label className="block text-small font-semibold text-slate-700">
                Experience & Skills <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => updateFormData('experience', e.target.value)}
                placeholder="Describe your experience, skills, and any certifications you have..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium placeholder-slate-400 focus:outline-none focus:ring-0 resize-none ${
                  errors.experience 
                    ? 'border-red-300 bg-red-50 focus:border-red-500' 
                    : 'border-slate-200 bg-white focus:border-emerald-500 hover:border-slate-300'
                }`}
              />
              {errors.experience && (
                <p className="text-small text-red-600 font-medium animate-in slide-in-from-left duration-300">
                  {errors.experience}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FileUpload
              files={formData.documents}
              onChange={(files) => updateFormData('documents', files)}
            />
            {errors.documents && (
              <p className="text-small text-red-600 font-medium">
                {errors.documents}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-mid font-bold text-slate-800">Expert Solutions</h1>
              <p className="text-small text-slate-600">Professional Technician Registration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-semibold text-slate-800">Secure & Trusted</h3>
                </div>
                <p className="text-small text-slate-600 leading-relaxed">
                  Your information is protected with enterprise-grade security and will only be used to connect you with relevant projects.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-amber-500" />
                  <h3 className="font-semibold text-slate-800">Join Elite Network</h3>
                </div>
                <p className="text-small text-slate-600 leading-relaxed">
                  Connect with premium clients and projects that match your expertise. Build your reputation and grow your business.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8">
                <StepIndicator steps={steps} currentStep={currentStep} />
                <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
                
                <div className="min-h-[500px]">
                  {renderStepContent()}
                </div>

                <StepNavigation
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  canProceed={canProceed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        technicianName={formData.firstName}
      />
    </div>
  );
}

export default App;