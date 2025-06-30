export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  isActive: boolean;
  createdAt?: string;
} 