import { ReactNode } from 'react';

export interface Product {
  attributes: any;
  data(data: any): unknown;
  imageUrl: any;
  createdAt: any;
  type: ReactNode;
  id: string;
  name: string;
  description: string;
  slug?: string;
  sku?: string;
  price: string;
  discount?: string;
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
  price?: string;
  images?: { url: string; alt?: string }[];
  details?: string[];
  rating?: number;
  reviewCount?: number;
};