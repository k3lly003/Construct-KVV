"use client"

import React from 'react'
import DefaultPageBanner from '../../(components)/DefaultPageBanner'
import { Products } from '@/app/(components)/Product'
import Head from 'next/head';
import { ServiceGrid } from '@/app/(components)/service/service-grid';
import { useState, useEffect } from "react";
import { ProductFilters } from "@/app/(components)/product/ProductFilters";
import { serviceService } from "@/app/services/serviceServices";

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Service");
  const [sortBy, setSortBy] = useState("featured");
  const availableCategories: string[] = ["Product", "Service"];
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    serviceService.getServices().then((res) => {
      const apiServices = res && typeof res === 'object' && 'data' in res ? (res as any).data : res;
      setServices(apiServices);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Filter services by title
  const filteredServices = services.filter((service) =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Products | Construct KVV</title>
        <meta name="description" content="Browse and shop the best construction products in Rwanda at KVV Construction. Quality, variety, and great prices." />
        <meta property="og:title" content="Products | Construct KVV" />
        <meta property="og:description" content="Browse and shop the best construction products in Rwanda at KVV Construction. Quality, variety, and great prices." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.constructkvv.com/product" />
        <meta property="og:image" content="/kvv-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Products | Construct KVV" />
        <meta name="twitter:description" content="Browse and shop the best construction products in Rwanda at KVV Construction." />
        <meta name="twitter:image" content="/kvv-logo.png" />
        <link rel="canonical" href="https://www.constructkvv.com/product" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Products',
          url: 'https://www.constructkvv.com/product',
          description: 'Browse and shop the best construction products in Rwanda at KVV Construction.'
        }) }} />
      </Head>
      <DefaultPageBanner title='store' backgroundImage='/store-img.jpg' />
      <ServiceGrid services={filteredServices} loading={loading} />
    </>
  )
}

export default page