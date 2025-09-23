import axios from "axios";

const API_BASE_URL = "https://construct-kvv-bn-fork.onrender.com/api/v1";

export async function initiateSplitPayment({
  sellerId,
  paymentType = "card",
  tx_ref,
  amount,
  currency = "RWF",
  redirect_url = "https://www.constructkvv.com/payment-complete",
  order_id,
  email,
  phone_number,
  narration,
  token,
  customizations,
}: {
  sellerId: string;
  paymentType?: string;
  tx_ref: string;
  amount: number;
  currency?: string;
  redirect_url?: string;
  order_id: string;
  email: string;
  phone_number: string;
  narration: string;
  token: string;
  customizations?: {
    title: string;
    description: string;
    logo: string;
  };
}) {
  const response = await axios.post(
    `${API_BASE_URL}/payment/initiate-split`,
    {
      sellerId,
      paymentType,
      payload: {
        tx_ref,
        amount,
        currency,
        redirect_url,
        order_id,
        email,
        phone_number,
        narration,
        ...(customizations ? { customizations } : {}),
      },
    },
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
