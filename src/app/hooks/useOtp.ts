import { useState } from "react";
import { otpService, VerifyOtpRequest, ResendOtpRequest } from "@/app/services/otpService";

export interface UseOtpReturn {
  // State
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  isVerified: boolean;
  
  // Actions
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  checkVerificationStatus: () => Promise<boolean>;
  clearError: () => void;
}

export const useOtp = (): UseOtpReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const clearError = () => setError(null);

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    if (!email || !otp) {
      setError("Email and OTP are required");
      return false;
    }

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data: VerifyOtpRequest = { email, otp };
      const response = await otpService.verifyOtp(data);
      
      if (response.success) {
        setIsVerified(true);
        return true;
      } else {
        setError(response.message || "Verification failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<boolean> => {
    if (!email) {
      setError("Email is required");
      return false;
    }

    setIsResending(true);
    setError(null);

    try {
      const data: ResendOtpRequest = { email };
      const response = await otpService.resendOtp(data);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || "Failed to resend OTP");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
      return false;
    } finally {
      setIsResending(false);
    }
  };

  const checkVerificationStatus = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await otpService.getVerificationStatus();
      
      if (response.success) {
        setIsVerified(response.data.emailVerified);
        return response.data.emailVerified;
      } else {
        setError("Failed to check verification status");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to check verification status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isResending,
    error,
    isVerified,
    verifyOtp,
    resendOtp,
    checkVerificationStatus,
    clearError,
  };
};



