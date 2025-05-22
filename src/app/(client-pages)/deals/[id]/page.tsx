// app/deals/[id]/page.tsx
"use client";

import React from "react";
// import Image, { StaticImageData } from "next/image";
import {
  // DealProduct,
  singleDealProduct,
  SingleDealProduct,
} from "../../../utils/fakes/ProductFakes";
import Specifications from "@/app/(components)/deals/Specifications";
import Share from "@/app/(components)/deals/single-view/ShareBid";
import DetailedSection from "@/app/(components)/deals/single-view/DetailedSection";
import ProductGallery from "@/app/(components)/product/ProductGallery";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
// import { DealProductDto } from "@/app/utils/dtos/deals.dtos";
// import { PaginatedProductGridProps } from "@/app/(components)/deals/ProductSection";

export interface PageProps {
   params: Promise<{id:string}>;
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DealViewPage: React.FC<PageProps> = ({params}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = React.use(params);
  const product: SingleDealProduct = singleDealProduct;

  return (
    <>
      <DefaultPageBanner backgroundImage="/architect.jpg" title={"Deals"}/>
      <div className="container max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery/>
          <DetailedSection />
        </div>
        <div className="my-5">
          <Share />
        </div>
        <hr className="my-10 border-1" />
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additonal Features
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
