export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  availability: string;
  features: string[];
  specifications: { key: string; value: string }[];
  provider: string;
  pricing: string;
  location: string;
  warranty: string;
  gallery: string[];
  createdAt?: string;
} 