import type { Seller } from "./seller";

export interface Shop {
    createdAt: string | undefined;
    id: string;
    name: string;
    description: string;
    logo: File | null;
    slug?: string;
    isActive: boolean;
    phone?: string;
    seller: Seller;
  } 