"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { GenericButton } from "@/components/ui/generic-button";
import Link from "next/link";
import { useOtp } from "@/app/hooks/useOtp";
import { useRouter } from "next/navigation";
import { getUserDataFromLocalStorage, updateUserDataInLocalStorage } from "@/app/utils/middlewares/UserCredentions";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  // Email is resolved in the background from stored user data
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const router = useRouter();
  
  // Initialize user data after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const data = getUserDataFromLocalStorage();
    setUserData(data);
    if (data?.email) {
      setEmail(data.email);
    }
  }, []);
  
  // Initialize or restore countdown on page load
  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem("otpExpiryAtMs");
      if (saved) {
        const ts = Number(saved);
        if (!Number.isNaN(ts) && ts > Date.now()) {
          setExpiryTimestamp(ts);
          return;
        }
        // saved value is stale
        localStorage.removeItem("otpExpiryAtMs");
      }
      // Start a fresh 10-minute window immediately on page load
      const ts = Date.now() + 10 * 60 * 1000;
      setExpiryTimestamp(ts);
      localStorage.setItem("otpExpiryAtMs", String(ts));
    } catch {
      // Even if localStorage fails, still start an in-memory countdown
      const ts = Date.now() + 10 * 60 * 1000;
      setExpiryTimestamp(ts);
    }
  }, [mounted]);
  
  // Validate email format
  const isValidEmail = email && email.includes("@") && email.includes(".");
  
  const {
    isLoading,
    isResending,
    error,
    isVerified,
    verifyOtp,
    resendOtp,
    clearError,
  } = useOtp();

  // Redirect to signin if no user data is found (only after mounting)
  useEffect(() => {
    if (mounted && !userData) {
      router.push("/signin");
    }
  }, [mounted, userData, router]);

  // Auto-verify when 6 digits are entered and a valid email is available
  useEffect(() => {
    if (otp.length === 6 && isValidEmail) {
      handleVerify();
    }
  }, [otp, isValidEmail]);

  // Automatically request/sent OTP in the background once we have a valid email
  useEffect(() => {
    if (mounted && isValidEmail && !hasRequestedCode) {
      resendOtp(email)
        .then((ok) => {
          if (ok) {
            const ts = Date.now() + 10 * 60 * 1000; // 10 minutes
            setExpiryTimestamp(ts);
            try { localStorage.setItem("otpExpiryAtMs", String(ts)); } catch {}
          }
        })
        .catch(() => {})
        .finally(() => setHasRequestedCode(true));
    }
  }, [mounted, isValidEmail, email, hasRequestedCode, resendOtp]);

  // Countdown ticker
  useEffect(() => {
    if (!expiryTimestamp) {
      setTimeLeftSeconds(0);
      return;
    }
    const update = () => {
      const deltaMs = expiryTimestamp - Date.now();
      setTimeLeftSeconds(Math.max(0, Math.floor(deltaMs / 1000)));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiryTimestamp]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerify = async () => {
    const success = await verifyOtp(email, otp);
    if (success) {
      console.log("Email verified successfully!");
      
      // Update user data in localStorage to set emailVerified to true
      if (userData && typeof userData === 'object') {
        const updatedUserData = {
          ...userData,
          emailVerified: true
        };
        const success = updateUserDataInLocalStorage(updatedUserData);
        if (success) {
          console.log("Updated user data with emailVerified: true");
        } else {
          console.error("Failed to update user data in localStorage");
        }
      }
      
      // Redirect immediately on success
      router.push("/signin");
    }
  };

  const handleResend = async () => {
    if (!isValidEmail) {
      // Prevent sending with an invalid or missing email
      return;
    }
    const success = await resendOtp(email);
    if (success) {
      console.log("OTP resent successfully!");
      const ts = Date.now() + 10 * 60 * 1000; // 10 minutes
      setExpiryTimestamp(ts);
      try { localStorage.setItem("otpExpiryAtMs", String(ts)); } catch {}
    }
  };

  // Test function to manually update emailVerified (for testing purposes)
  const testUpdateEmailVerified = () => {
    if (userData && typeof userData === 'object') {
      const updatedUserData = {
        ...userData,
        emailVerified: true
      };
      const success = updateUserDataInLocalStorage(updatedUserData);
      if (success) {
        console.log("Test: Updated emailVerified to true");
        // Force re-render to show updated data
        window.location.reload();
      }
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    clearError(); // Clear error when user starts typing
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
            <h1 className="text-title font-bold text-gray-900 mb-3">
              Check your email
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Enter the 6-digit verification code sent to
            </p>
            <p className="font-semibold text-gray-900 mt-1">
              {mounted ? email : "Loading..."}
            </p>
            {mounted && !isValidEmail && (
              <p className="text-amber-600 text-small mt-2">
                ⚠️ Please ensure you have a valid email address
              </p>
            )}
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-mid font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-mid font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-mid font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-mid font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-mid font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-mid font-semibold border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-small text-center mb-4">{error}</p>
            )}

            {/* Success Message */}
            {isVerified && (
              <div className="flex items-center justify-center mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-700 text-small font-medium">
                  Email verified successfully! emailVerified set to TRUE. Redirecting...
                </p>
              </div>
            )}
          </div>

          {/* Resend Link */}
          <div className="text-center mb-8">
            <span className="text-gray-600">Didn&apos;t get a code? </span>
            <button
              onClick={handleResend}
              disabled={isResending || isVerified}
              className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : isVerified ? "Verified" : "Resend"}
            </button>
            <div className="mt-2 text-small text-gray-500">
              {timeLeftSeconds > 0 ? (
                <span className="text-red-500">Code expires in {formatTime(timeLeftSeconds)}</span>
              ) : (
                <span className="text-red-500">Code expired. Please resend.</span>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <GenericButton
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading || isVerified}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : isVerified ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verified!
              </>
            ) : (
              "Verify Email"
            )}
          </GenericButton>

          {/* Security Note */}
          <div className="text-center mt-6">
            <p className="text-small text-gray-500 leading-relaxed">
              Enter the 6-digit code sent to your email. You'll be redirected automatically once verified.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-small">
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
