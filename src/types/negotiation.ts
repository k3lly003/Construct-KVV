export interface NegotiationMessage {
  id: string;
  bidId: string;
  senderId: string;
  senderType: 'USER' | 'SELLER' | 'CUSTOMER';
  message: string;
  fileUrl?: string;
  createdAt: string;
}

export interface CreateNegotiationMessageDTO {
  bidId: string;
  message: string;
  senderType: 'USER' | 'SELLER' | 'CUSTOMER';
  file?: File;
} 