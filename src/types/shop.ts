export interface Shop {
    createdAt: string | undefined;
    id: string;
    name: string;
    description: string;
    logo: File | null;
    slug?: string;
    isActive: boolean;
    phone?: string;
    sellerName?: string;
    updatedAt?: string;
    sellerId?: string;
    seller?: {
        id: string;
        businessName: string;
        userId: string;
    };
    productsCount?: number;
    servicesCount?: number;
} 