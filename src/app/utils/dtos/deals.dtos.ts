import { StaticImageData } from "next/image";

export interface SpecificationItem {
    label: string;
    value: string | number | boolean;
}

interface DetailItem {
  label: string;
  value: string;
}

interface WarrantyItem {
  label: string;
  value: string;
}

interface ResourcesItem {
  label: string;
  url: string;
}

export interface SpecificationsProps {
  dimensions: SpecificationItem[];
  details: DetailItem[];
  warranty: WarrantyItem[];
  resources: ResourcesItem[];
}

export interface DealProductDto {
  isActive: any;
  sku: any;
  id: string;
  name: string;
  category?: string;
  price?: number;
  minOrder: number;
  unit: string;
  imageSrc?: string[] | StaticImageData[];
  availability: "In Stock" | "Made to Order" | "Limited Stock";
  leadTime: string;
  features: string[];
  certifications: string[];
  description?: string; // Optional, likely only on the single view
  saleInfo?: { // Optional, for products on sale
    onSale: boolean;
    originalPrice?: number;
    discountPercentage?: number;
    offerEnds?: string;
  };
  selectedStyle?: string;
  availableStyles?: string[];
  altText?: string;
  productThumbnail?: string | StaticImageData; // Optional, might be the same as 'image' for listings
}

export interface FormDataDto {
    company: string;
    contact: string;
    email: string;
    phone: string;
    requirements: string;
    deliveryLocation: string;
    preferredDeliveryDate: string;
}

export interface ShadQuotaPropsDto {
    isOpen: boolean;
    onClose: () => void;
    product: DealProductDto | null;
    initialQuantity: number;
    formData: FormDataDto;
    onFormDataChange: (data: FormDataDto) => void;
    onSubmitQuote: (event: React.FormEvent) => void;
    onQuantityChange: (quantity: number) => void;
    calculateTotal: () => number;
}