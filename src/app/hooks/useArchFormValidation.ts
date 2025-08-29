import { useState, useEffect } from 'react';
// import { TechnicianFormData } from '../types';

interface ValidationErrors {
  [key: string]: string;
}
interface TechnicianFormData {
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

export const useFormValidation = (formData: TechnicianFormData, currentStep: number) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+?25)?07[8|2|3|9]\d{7}$/;
    return phoneRegex.test(phone);
  };

  const getErrorsForStep = (step: number, data: TechnicianFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!data.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(data.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!data.password) {
          newErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (!data.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (data.password !== data.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!data.phoneNumber.trim()) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!validatePhone(data.phoneNumber)) {
          newErrors.phoneNumber = 'Please enter a valid Rwandan phone number';
        }
        break;

      case 2:
        if (data.categories.length === 0) {
          newErrors.categories = 'Please select at least one category';
        }
        break;

      case 3:
        if (!data.province) newErrors.province = 'Province is required';
        if (!data.district) newErrors.district = 'District is required';
        if (!data.cell) newErrors.cell = 'Cell is required';
        if (!data.experience.trim()) newErrors.experience = 'Experience description is required';
        break;

      case 4:
        if (data.documents.length === 0) {
          newErrors.documents = 'Please upload at least one document';
        }
        break;
    }

    return newErrors;
  };

  // Update errors whenever formData or currentStep changes
  useEffect(() => {
    const currentErrors = getErrorsForStep(currentStep, formData);
    setErrors(currentErrors);
  }, [formData, currentStep]);

  const isCurrentStepValid = Object.keys(errors).length === 0;

  const validateCurrentStep = (): boolean => {
    const currentErrors = getErrorsForStep(currentStep, formData);
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  return { errors, isCurrentStepValid, validateCurrentStep, setErrors };
};