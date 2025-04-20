// app/deals/[id]/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DealProduct,
  singleDealProduct,
  SingleDealProduct,
} from "../../../utils/fakes/ProductFakes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Specifications from "@/app/(components)/deals/Specifications";
import Share from "@/app/(components)/deals/single-view/ShareBid";
import DetailedSection from "@/app/(components)/deals/single-view/DetailedSection";
import { DealProductDto } from "@/app/utils/dtos/deals.dtos";
// import { PaginatedProductGridProps } from "@/app/(components)/deals/ProductSection";

export interface PaginatedProductGridProps {
  products: DealProduct[];
  itemsPerPage: number;
  onQuoteRequest: (product: DealProductDto) => void;
}

const DealViewPage: React.FC<PaginatedProductGridProps> = ({}) => {
  const product: SingleDealProduct = singleDealProduct;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const allImages = [product.productThumbnail, ...product.imageSrc];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSwiper = (swiper: any) => {
    setThumbsSwiper(swiper);
  };

  return (
    <>
      <div className="container max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden shadow-md">
            <div className="flex justify-center py-2">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="rounded-lg min-w-[100%] box-border"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="w-[100%] rounded-lg shadow-lg"
                  >
                    <div className="relative w-full h-96">
                      <Image
                        src={image}
                        alt={product.altText}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/product.png";
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="w-full flex space-x-2 justify-start mt-3">
              <div className="w-[100%] h-[5em] flex">
                <Swiper
                  onSwiper={handleSwiper}
                  spaceBetween={10}
                  slidesPerView={Math.min(allImages.length, 4)} // Display up to 4 thumbnails
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="min-w-[100%] max-h-[100px] mySwiper4"
                >
                  {allImages.map((image, index) => (
                    <SwiperSlide
                      key={index}
                      className="opacity-[0.6] hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`${product.altText} thumbnail ${index}`}
                          fill
                          className="object-cover rounded-md"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/product.png";
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <DetailedSection />
        </div>
        <div className="my-5">
          <Share />
        </div>
        <hr className="my-10 border-1" />
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Product Features
          </h2>
          <ul className="list-disc list-inside text-gray-600">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <hr className="my-10 border-1" />
        <Specifications
          dimensions={[
            { label: "Product Length (in)", value: 47.8 },
            { label: "Total Thickness (mm)", value: 10.0 },
            { label: "Underpad Thickness (mm)", value: 2.0 },
            { label: "Width (in)", value: 7.67 },
          ]}
          details={[
            { label: "Ac Durability Rating", value: "AC4" },
            { label: "Click Lock Type", value: "Unilin Click Lock" },
            { label: "Color", value: "Beige" },
            { label: "Edge Type", value: "Mirco Bevel" },
            { label: "Gloss Level", value: "Matte" },
            { label: "Grade", value: "Above/On/Below Grade" },
            { label: "Installation", value: "Floating" },
            { label: "Prop 65", value: "https://www.p65warnings.ca.gov/" },
            { label: "Recommended Waste Factor", value: "10%" },
            { label: "Shade", value: "Light Shade" },
            { label: "Surface Finish", value: "" },
            { label: "Texture Detail", value: "Embossed in Register (EIR)" },
            { label: "Underpad Attached", value: "Yes" },
            { label: "Waterproof Water Resistant", value: "Waterproof" },
          ]}
          warranty={[
            { label: "Residential Warranty (in years)", value: "Lifetime" },
          ]}
          resources={[
            {
              label: "Laminate Flooring - Pre-Installation Checklist",
              url: "#",
            },
            {
              label: "Laminate Flooring - Installation Instructions",
              url: "#",
            },
            {
              label: "Laminate Flooring - Care and Maintenance Guide",
              url: "#",
            },
            { label: "Laminate Flooring - Warranty", url: "#" },
            { label: "Moldings - Pre-Installation Checklist", url: "#" },
          ]}
        />
      </div>
    </>
  );
};

export default DealViewPage;
