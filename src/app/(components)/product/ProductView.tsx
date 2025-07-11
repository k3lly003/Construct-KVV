"use client";

import { useState } from "react";
import ProductGallery from "@/app/(components)/product/ProductGallery";
import ProductInfo from "@/app/(components)/product/ProductInfo";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isDefault: boolean;
}

interface ProductViewProps {
  product: any; // You can replace 'any' with a more specific type if available
}

export default function ProductView({ product }: ProductViewProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <ProductGallery images={product.images || []} />
        <ProductInfo product={product} quantity={quantity} setQuantity={setQuantity} />
      </div>
    </section>
  );
}