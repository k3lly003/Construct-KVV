import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Phone utilities
export function detectNetwork(phone: string): "MTN" | "AIRTEL" | null {
  const cleaned = phone.replace(/\D/g, "").replace(/^250/, "0");
  if (/^07[89]/.test(cleaned)) return "MTN";
  if (/^07[23]/.test(cleaned)) return "AIRTEL";
  return null;
}

export function validateRwandaPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "").replace(/^250/, "0");
  if (!cleaned) return "Phone number is required";
  if (!/^07[2389]\d{7}$/.test(cleaned))
    return "Enter a valid MTN (078/079) or Airtel (072/073) number";
  return "";
}

export function decodeResponseCode(code: string): string {
  const codes: Record<string, string> = {
    "01": "Transaction successful",
    "1000": "Payment initiated successfully",
    "1001": "Transaction successful",
    "1002": "Number not supported on mobile money network",
    "1003": "Insufficient funds",
    "1004": "Transaction declined by user",
    "1005": "Transaction timed out",
  };
  return codes[code] || "Unknown error occurred";
}

/**
 * Central success detection — handles:
 *  - "Successful"   (standard)
 *  - "Successfull"  (InTouchPay typo — double L)
 *  - "completed"    (some backend normalizations)
 *  - responsecode "01" or "1001" (fallback when status string is unreliable)
 */
function isSuccessStatus(status: string, responsecode: string): boolean {
  const normalized = status.toLowerCase().trim();
  return (
    normalized === "successful" || // standard
    normalized === "successfull" || // InTouchPay typo — double L ← THE BUG FIX
    normalized === "completed" || // backend normalization
    responsecode === "01" || // InTouchPay success code
    responsecode === "1001" // backend success code
  );
}

/**
 * Central failure detection
 */
function isFailedStatus(status: string): boolean {
  const normalized = status.toLowerCase().trim();
  return (
    normalized === "failed" ||
    normalized === "failure" ||
    normalized === "cancelled" ||
    normalized === "rejected"
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IntouchPaymentPayload {
  amount: number;
  phoneNumber: string;
  currency?: string;
  description?: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  pin?: string;
}

export interface IntouchPaymentResponse {
  message: string;
  data: {
    status: string;
    requesttransactionid: string;
    success: boolean;
    responsecode: string;
    provider: {
      code: string;
      name: string;
    };
    transactionid: string;
    message: string;
  };
  transactionId: string;
  reference: string;
}

export interface IntouchTransaction {
  message: string;
  data: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paymentType: string;
    description: string;
    senderId: string | null;
    receiverId: string | null;
    intouchRef: string;
    intouchAccountId: string | null;
    platformFee: number;
    netAmount: number;
    metadata: {
      userId: string;
      apiType: string;
      paymentType: string;
      phoneNumber: string;
      requestedAt: string;
      totalAmount: number;
      customerName: string;
      sellerAmount: number;
      customerEmail: string;
      originalTimestamp: string;
      platformCommission: number;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface IntouchTransactionStatus {
  message: string;
  data: {
    status: string;
    referenceid: string;
    success: boolean;
    referenceno: string;
    responsecode: string;
    transactionid: string;
    message: string;
  };
}

export interface PollResult {
  liveStatus: IntouchTransactionStatus;
  transaction: IntouchTransaction;
  isSuccess: boolean;
  isFailed: boolean;
}

// ─── API 1: Initiate Payment ──────────────────────────────────────────────────

export async function initiateIntouchPayment(
  payload: IntouchPaymentPayload,
  token: string,
): Promise<IntouchPaymentResponse> {
  console.log("[Intouch Payment] 🚀 Initiating payment:", {
    amount: payload.amount,
    phoneNumber: payload.phoneNumber,
    customerName: payload.customerName,
    sellerId: payload.sellerId,
  });

  const response = await axios.post(
    `${BASE_URL}/api/v1/intouch/payment/request`,
    {
      amount: payload.amount,
      phoneNumber: payload.phoneNumber,
      currency: payload.currency || "RWF",
      description: payload.description,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      sellerId: payload.sellerId,
      ...(payload.pin ? { pin: payload.pin } : {}),
    },
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  console.log(
    "[Intouch Payment] 📥 Payment initiation response:",
    response.data,
  );
  return response.data;
}

// ─── API 2: Get Full Transaction Record ───────────────────────────────────────

export async function getIntouchTransaction(
  reference: string,
  token: string,
): Promise<IntouchTransaction> {
  const response = await axios.get(
    `${BASE_URL}/api/v1/intouch/transaction/${reference}`,
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

// ─── API 3: Get Live Transaction Status ──────────────────────────────────────

export async function getIntouchTransactionStatus(
  reference: string,
  token: string,
): Promise<IntouchTransactionStatus> {
  const response = await axios.get(
    `${BASE_URL}/api/v1/intouch/transaction/${reference}/status`,
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

// ─── Polling Helper ───────────────────────────────────────────────────────────

export async function pollIntouchPaymentStatus(
  reference: string,
  token: string,
  options?: {
    intervalMs?: number; // default 5000
    maxAttempts?: number; // default 24
    onUpdate?: (result: PollResult) => void;
  },
): Promise<PollResult> {
  const intervalMs = options?.intervalMs ?? 5000;
  const maxAttempts = options?.maxAttempts ?? 24;

  console.log(
    "[Intouch Polling] 🚀 Starting polling for reference:",
    reference,
  );
  console.log("[Intouch Polling] ⚙️ Config:", { intervalMs, maxAttempts });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`[Intouch Polling] 📡 Attempt ${attempt + 1}/${maxAttempts}`);

      // Call API 2 + API 3 in parallel
      const [transaction, liveStatus] = await Promise.all([
        getIntouchTransaction(reference, token),
        getIntouchTransactionStatus(reference, token),
      ]);

      const rawStatus = liveStatus.data.status;
      const rawCode = liveStatus.data.responsecode;
      const resolvedSuccess = isSuccessStatus(rawStatus, rawCode);
      const resolvedFailed = isFailedStatus(rawStatus);

      const result: PollResult = {
        liveStatus,
        transaction,
        isSuccess: resolvedSuccess,
        isFailed: resolvedFailed,
      };

      console.log("[Intouch Polling] 📊 Status check result:", {
        attempt: attempt + 1,
        rawStatus,
        rawCode,
        normalised: rawStatus.toLowerCase().trim(),
        resolvedSuccess,
        resolvedFailed,
        success: liveStatus.data.success,
      });

      // Notify caller
      if (options?.onUpdate) {
        options.onUpdate(result);
      }

      // ── THE FIX: use isSuccessStatus / isFailedStatus instead of raw string ──
      if (resolvedSuccess || resolvedFailed) {
        console.log(
          `[Intouch Polling] ✅ Settled — isSuccess=${resolvedSuccess} isFailed=${resolvedFailed}`,
        );
        return result;
      }

      console.log(
        `[Intouch Polling] ⏳ Waiting ${intervalMs}ms before next attempt...`,
      );
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    } catch (error) {
      console.error(
        `[Intouch Polling] ❌ Error on attempt ${attempt + 1}:`,
        error,
      );
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  console.error(
    "[Intouch Polling] ⏰ Polling timed out after",
    maxAttempts,
    "attempts",
  );
  throw new Error("Payment status polling timed out");
}
