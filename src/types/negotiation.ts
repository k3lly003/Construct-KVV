export interface NegotiationMessage {
  id: string;
  bidId: string;
  senderId: string;
  senderType: 'USER' | 'SELLER';
  message: string;
  fileUrl?: string;
  createdAt: string;
}

export interface CreateNegotiationMessageDTO {
  bidId: string;
  message: string;
  senderType: 'USER' | 'SELLER';
  file?: File;
} 