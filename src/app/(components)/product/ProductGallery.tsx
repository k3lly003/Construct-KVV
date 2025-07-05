"use client";

import jacket01 from "../../../../public/jacket01.webp";
import jacket02 from "../../../../public/jacket02.webp";
import jacket03 from "../../../../public/jacket03.webp";
import jacket04 from "../../../../public/jacket04.webp";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of all images
  const allImages = [jacket01, jacket02, jacket03, jacket04];
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
    return <div className="text-red-500">No images available.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Main image with navigation */}
      <div className="relative bg-muted border-1 rounded-lg overflow-hidden aspect-square">
        {/* Display the main image */}
        {mainImage && (
          <Image
            src={mainImage}
            alt={`Product image ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: "cover" }}
          />
        )}

        {/* Navigation arrows (only show if there's more than one image) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 justify-center">
          {thumbnails.map((thumbnailSrc, index) => (
            <div
              key={index}
              onClick={() => goToThumbnail(index)}
              className={`relative w-16 h-16 rounded-md  overflow-hidden transition-all cursor-pointer ${
                currentImageIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground"
              }`}
              aria-label={`View thumbnail ${index + 1}`}
            >
              <Image
                src={thumbnailSrc}
                alt={`Thumbnail ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}