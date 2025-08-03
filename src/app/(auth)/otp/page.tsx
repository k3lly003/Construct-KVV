"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { GenericButton } from "@/components/ui/generic-button";
import Link from "next/link";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email] = useState("user@example.com"); // In real app, this would come from props/context
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, you'd verify the OTP with your backend
    console.log("Verifying OTP:", otp);

    setIsLoading(false);
    // Handle success/error based on API response
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Resending OTP to:", email);
    setIsResending(false);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(""); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/signin" className="block mb-4">
          <GenericButton
            variant="ghost"
            size="sm"
            className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-white/50"
          >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </GenericButton>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-amber-500/10 p-8 border border-amber-100">
          {/* Mail Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Check your email
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Enter the 6-digit verification code sent to
            </p>
            <p className="font-semibold text-gray-900 mt-1">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
          </div>

          {/* Resend Link */}
          <div className="text-center mb-8">
            <span className="text-gray-600">Didn&apos;t get a code? </span>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </div>

          {/* Verify Button */}
          <GenericButton
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </GenericButton>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            This code will expire in 10 minutes. Keep this window open while you
            check your email.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Having trouble?{" "}
            <a
              href="#"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
