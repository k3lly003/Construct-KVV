  export interface Product {
    id: string;
    name: string;
    description: string;
    slug?: string;
    sku?: string;
    price: number;
    discount?: number;
    stock: number;
    availability?: string;
    minOrder?: number;
    maxOrder?: number;
    image?: string[];
    thumbnailUrl: string;
    dateCreated?: string;
  }
  export type ProductPreviewProps = {
    name?: string;
    description?: string;
    price?: number;
    images?: { url: string; alt?: string }[];
    details?: string[];
    rating?: number;
    reviewCount?: number;
  };