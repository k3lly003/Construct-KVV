// src/types/seller.ts
export interface Seller {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    taxId: string;
    sellerId?: string;
    id?: string;
}