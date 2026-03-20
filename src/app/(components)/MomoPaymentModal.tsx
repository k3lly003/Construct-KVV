"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, XCircle, Smartphone } from "lucide-react";
import {
  detectNetwork,
  validateRwandaPhone,
  decodeResponseCode,
  initiateIntouchPayment,
  pollIntouchPaymentStatus,
  pollLocalPaymentStatus,
  type PollResult,
  type IntouchPaymentPayload,
} from "@/app/services/intouchPaymentService";
import { toast } from "sonner";

interface MomoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  orderId: string;
  onSuccess: (transactionId: string, reference: string) => void;
  onFailure?: (message: string) => void;
}

type Step = "input" | "pending" | "success" | "failed";

export const MomoPaymentModal: React.FC<MomoPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  customerName,
  customerEmail,
  sellerId,
  orderId,
  onSuccess,
  onFailure,
}) => {
  const [step, setStep] = useState<Step>("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pollResult, setPollResult] = useState<PollResult | null>(null);
  const [error, setError] = useState<string>("");

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep("input");
      setPhoneNumber("");
      setPaymentData(null);
      setPollResult(null);
      setError("");
    }
  }, [isOpen]);

  // Get network badge styling
  const getNetworkBadge = (network: string | null) => {
    switch (network) {
      case "MTN":
        return {
          text: "MTN MoMo",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-300",
        };
      case "AIRTEL":
        return {
          text: "Airtel Money",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-300",
        };
      default:
        return {
          text: "Enter number",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          borderColor: "border-gray-300",
        };
    }
  };

  const detectedNetwork = detectNetwork(phoneNumber);
  const networkBadge = getNetworkBadge(detectedNetwork);

  const handleSubmit = async () => {
    // Validate phone number
    const validationError = validateRwandaPhone(phoneNumber);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get auth token
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token) {
        throw new Error("Authentication required");
      }

      // Prepare payment payload
      const payload: IntouchPaymentPayload = {
        amount,
        phoneNumber,
        currency: "RWF",
        description,
        customerName,
        customerEmail,
        sellerId,
      };

      // Initiate payment
      const response = await initiateIntouchPayment(payload, token);
      setPaymentData(response);
      setStep("pending");

      // Start polling for payment status

      pollLocalPaymentStatus(
        response.reference,
        token,
        (status) => {
        }
      ).then((result) => {
        setStep("success");
        onSuccess(result.intouchRef, result.reference);
      }).catch((err: any) => {
        setStep("failed");
        setError(err.message);
        if (onFailure) onFailure(err.message);
      });
    } catch (err: any) {
      setError(err?.message || "Payment initiation failed");
      toast.error(err?.message || "Payment initiation failed");
      setStep("failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStep("input");
    setPhoneNumber("");
    setPaymentData(null);
    setPollResult(null);
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    if (step === "pending") {
      // Don't allow closing while payment is pending
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Mobile Money Payment</h2>
          <button
            onClick={handleClose}
            disabled={step === "pending"}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              step === "pending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1 - Input */}
          {step === "input" && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">RWF {amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="text-sm text-right">{description}</span>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0781234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    disabled={loading}
                  />
                  {/* Network Badge */}
                  <div className="absolute -top-2 -right-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${networkBadge.bgColor} ${networkBadge.textColor} ${networkBadge.borderColor}`}
                    >
                      {networkBadge.text}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Enter MTN (078/079) or Airtel (072/073) number
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !phoneNumber}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay RWF ${amount.toLocaleString()}`
                )}
              </button>
            </div>
          )}

          {/* Step 2 - Pending */}
          {step === "pending" && (
            <div className="space-y-6 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto" />
              
              {paymentData && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {paymentData.data.provider.name}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {paymentData.data.message}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">
                        {pollResult?.transaction.data.status || "PENDING"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-mono text-sm">
                        {paymentData.reference}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Waiting for payment approval...
                  </p>
                </>
              )}
            </div>
          )}

          {/* Step 3 - Success */}
          {step === "success" && pollResult && (
            <div className="space-y-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              
              <div>
                <h3 className="font-semibold text-lg text-green-600">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mt-2">
                  Your payment has been completed successfully
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    RWF {pollResult.transaction.data.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">
                    RWF {pollResult.transaction.data.platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Amount:</span>
                  <span className="font-medium">
                    RWF {pollResult.transaction.data.netAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {pollResult.transaction.data.intouchRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-sm">
                    {pollResult.transaction.data.reference}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Step 4 - Failed */}
          {step === "failed" && (
            <div className="space-y-6 text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto" />
              
              <div>
                <h3 className="font-semibold text-lg text-red-600">
                  Payment Failed
                </h3>
                <p className="text-gray-600 mt-2">
                  {error || "Payment could not be completed"}
                </p>
              </div>

              {paymentData && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono text-sm">
                      {paymentData.reference}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
