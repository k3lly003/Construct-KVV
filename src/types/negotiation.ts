export interface NegotiationMessage {
  id: string;
  bidId: string;
  senderId: string;
  senderType: "USER" | "CONTRACTOR" | "CUSTOMER";
  message: string;
  fileUrl?: string;
  createdAt: string;
}

export interface CreateNegotiationMessageDTO {
  bidId: string;
  message: string;
  senderType: "USER" | "CONTRACTOR" | "CUSTOMER";
  file?: File;
  proposedAmount?: number;
}
