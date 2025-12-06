import axios from "@/lib/axios";
import axiosDirect from "axios";

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  data: {
    emailVerified: boolean;
  };
}

class OtpService {
  private baseUrl = `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_API_URL_2 || 'https://construct-kvv-bn-fork-production.up.railway.app'}/api/v1/email-verification`;

  /**
   * Verify email OTP
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      console.log("OTP Service: Making verify request to:", `${this.baseUrl}/verify`);
      console.log("OTP Service: Request data:", data);
      const response = await axiosDirect.post<VerifyOtpResponse>(`${this.baseUrl}/verify`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("OTP Service: Response:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Handle specific error responses
        switch (error.response.status) {
          case 400:
            console.log("OTP Service: 400 Error Response:", error.response.data);
            throw new Error(error.response.data?.message || "Invalid OTP or email");
          case 404:
            throw new Error("User not found");
          default:
            throw new Error(error.response.data?.message || "Verification failed");
        }
      }
      throw new Error("Network error occurred");
    }
  }

  /**
   * Resend email verification OTP
   */
  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      console.log("OTP Service: Making resend request to:", `${this.baseUrl}/resend`);
      console.log("OTP Service: Request data:", data);
      const response = await axiosDirect.post<ResendOtpResponse>(`${this.baseUrl}/resend`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("OTP Service: Response:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Handle specific error responses
        switch (error.response.status) {
          case 400:
            console.log("OTP Service: 400 Error Response (Resend):", error.response.data);
            throw new Error(error.response.data?.message || "Email already verified or invalid email");
          case 404:
            throw new Error("User not found");
          default:
            throw new Error(error.response.data?.message || "Failed to resend OTP");
        }
      }
      throw new Error("Network error occurred");
    }
  }

  /**
   * Check email verification status
   */
  async getVerificationStatus(): Promise<VerificationStatusResponse> {
    try {
      const response = await axiosDirect.get<VerificationStatusResponse>(`${this.baseUrl}/status`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Handle specific error responses
        switch (error.response.status) {
          case 401:
            throw new Error("Unauthorized");
          default:
            throw new Error(error.response.data?.message || "Failed to get verification status");
        }
      }
      throw new Error("Network error occurred");
    }
  }
}

export const otpService = new OtpService();





