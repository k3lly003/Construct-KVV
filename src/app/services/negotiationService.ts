import axios from "axios";
import {
  NegotiationMessage,
  CreateNegotiationMessageDTO,
} from "@/types/negotiation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const negotiationService = {
  async getNegotiationHistory(
    bidId: string,
    authToken: string
  ): Promise<NegotiationMessage[]> {
    const response = await axios.get(
      `${API_URL}/api/v1/negotiations/bid/${bidId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data as NegotiationMessage[];
  },

  async sendNegotiationMessage(
    data: CreateNegotiationMessageDTO,
    authToken: string
  ): Promise<NegotiationMessage> {
    const formData = new FormData();
    formData.append("bidId", data.bidId);
    formData.append("message", data.message);
    formData.append("senderType", data.senderType);
    if (data.file) {
      formData.append("file", data.file);
    }
    if (data.proposedAmount !== undefined) {
      formData.append("proposedAmount", String(data.proposedAmount));
    }

    const response = await axios.post(
      `${API_URL}/api/v1/negotiations`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data as NegotiationMessage;
  },
};
