"use client";

import React from "react";
import Head from 'next/head';
// import Image, { StaticImageData } from "next/image";
import {
  // DealProduct,
  singleDealProduct,
  SingleDealProduct,
} from "@/app/utils/fakes/ProductFakes";
import Specifications from "@/app/(components)/deals/Specifications";
import Share from "@/app/(components)/deals/single-view/ShareBid";
import DetailedSection from "@/app/(components)/deals/single-view/DetailedSection";
import ProductGallery from "@/app/(components)/product/ProductGallery";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";

const DealViewPage: React.FC = () => {
  const product: SingleDealProduct = singleDealProduct;

  // Map product.imageSrc to ProductGallery's expected format
  const galleryImages = (product.imageSrc || []).map((img, idx) => ({
    id: String(idx),
    url: typeof img === 'string' ? img : (img.src || ''),
    alt: product.altText || product.name || `Product image ${idx + 1}`,
    isDefault: idx === 0,
  }));

  return (
    <>
      <Head>
        <title>{product.name ? `${product.name} | Deal | Construct KVV` : 'Deal | Construct KVV'}</title>
        <meta name="description" content={product.description || 'View deal details at Construct KVV.'} />
        <meta property="og:title" content={product.name ? `${product.name} | Deal | Construct KVV` : 'Deal | Construct KVV'} />
        <meta property="og:description" content={product.description || 'View deal details at Construct KVV.'} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.constructkvv.com/deals/${product.id || '1'}`} />
        <meta property="og:image" content={product.imageSrc && product.imageSrc.length > 0 ? (typeof product.imageSrc[0] === 'string' ? product.imageSrc[0] : product.imageSrc[0].src) : '/kvv-logo.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name ? `${product.name} | Deal | Construct KVV` : 'Deal | Construct KVV'} />
        <meta name="twitter:description" content={product.description || 'View deal details at Construct KVV.'} />
        <meta name="twitter:image" content={product.imageSrc && product.imageSrc.length > 0 ? (typeof product.imageSrc[0] === 'string' ? product.imageSrc[0] : product.imageSrc[0].src) : '/kvv-logo.png'} />
        <link rel="canonical" href={`https://www.constructkvv.com/deals/${product.id || '1'}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.imageSrc && product.imageSrc.length > 0 ? (typeof product.imageSrc[0] === 'string' ? product.imageSrc[0] : product.imageSrc[0].src) : undefined,
          description: product.description,
          sku: product.sku,
          brand: {
            '@type': 'Brand',
            name: 'Construct KVV'
          },
          offers: product.price ? {
            '@type': 'Offer',
            priceCurrency: 'RWF',
            price: product.price,
            availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://www.constructkvv.com/deals/${product.id || '1'}`
          } : undefined
        }) }} />
      </Head>
      <DefaultPageBanner backgroundImage="/architect.jpg" title={"Deals"} />
      <div className="container max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={galleryImages} />
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
