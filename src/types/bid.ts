export interface Bid {
  id: string;
  finalProjectId: string;
  sellerId: string;
  amount: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBidDTO {
  finalProjectId: string;
  amount: number;
  message?: string;
  agreedToTerms: boolean;
} 