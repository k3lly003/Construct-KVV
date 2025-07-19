import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://construct-kvv-bn-fork.onrender.com";

export interface PaymentPayload {
  paymentType: "bank" | "mobilemoney" | "card";
  sellerId: string;
  payload: Record<string, any>;
}

export async function initiateSplitPayment(
  data: PaymentPayload,
  token: string
) {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/payment/initiate-split`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
