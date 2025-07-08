import React, { useState } from "react";
import ProductInfo from "@/app/(components)/product/ProductInfo";

// ProductGallery for dynamic images from the form
const ProductGallery = ({ images }: { images: { url: string; alt?: string }[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = images && images.length > 0 && images[0].url ? images : [];
  const mainImage = allImages[currentImageIndex];
  const thumbnails = allImages;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToThumbnail = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!mainImage) {
    return <div className="w-full max-w-xs h-80 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">No Image</div>;
  }

  return (
    <div className="space-y-4">
      {/* Main image with navigation */}
      <div className="relative bg-muted border-1 rounded-lg overflow-hidden aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainImage.url}
          alt={mainImage.alt || `Product image ${currentImageIndex + 1}`}
          className="object-cover w-full h-80"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              aria-label="Previous image"
            >
              {"<"}
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              aria-label="Next image"
            >
              {">"}
            </button>
          </>
        )}
      </div>
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 justify-center">
          {thumbnails.map((img, index) => (
            <div
              key={index}
              onClick={() => goToThumbnail(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden transition-all cursor-pointer ${
                currentImageIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground"
              }`}
              aria-label={`View thumbnail ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || `Thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main ProductPreview
export type ProductPreviewProps = {
  name?: string;
  description?: string;
  price?: number;
  images?: { url: string; alt?: string }[];
  details?: string[];
  rating?: number;
  reviewCount?: number;
};

const ProductPreview: React.FC<ProductPreviewProps> = ({
  name = "",
  description = "",
  price = 0,
  images = [],
  details = [],
  rating = 4.8,
  reviewCount = 124,
}) => {
  const [quantity, setQuantity] = useState(1);

  // Compose a product object for ProductInfo
  const product = {
    id: "preview",
    name: name || "Product Name",
    price: price || 0,
    description: description || "Product description...",
    details: details.length ? details : ["Feature 1", "Feature 2"],
    rating: rating || 4.8,
    reviewCount: reviewCount || 124,
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <ProductGallery images={images} />
        <ProductInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </section>
  );
};

export default ProductPreview; 