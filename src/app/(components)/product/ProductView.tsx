"use client";

import { useState } from "react";
import ProductGallery from "@/app/(components)/product/ProductGallery";
import ProductInfo from "@/app/(components)/product/ProductInfo";

export default function ProductView() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  
  const product = {
    id: "jacket-001",
    name: "All-Weather Performance Jacket",
    price: 299.99,
    description: "Our flagship performance jacket designed for versatility in all weather conditions. Features premium insulation, water-resistant exterior, and sleek design that transitions seamlessly from outdoor adventures to urban settings.",
    details: [
      "Lightweight thermal insulation",
      "Water-resistant outer shell",
      "Adjustable cuffs",
      "Interior zip pocket",
      "Reflective logo for visibility",
      "Machine washable",
    ],
    rating: 4.8,
    reviewCount: 124,
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <ProductGallery />
        <ProductInfo 
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </section>
  );
}