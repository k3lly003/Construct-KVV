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
  id: string;
  name: string;
  category: string;
  basePrice: number;
  minOrder: number;
  unit: string;
  image: string;
  marketPrice: number;
  availability: "In Stock" | "Made to Order" | "Limited Stock";
  leadTime: string;
  features: string[];
  certifications: string[];
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