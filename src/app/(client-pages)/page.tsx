"use client";

import { useState, useEffect } from "react";
import { BrickLoader } from "../(components)/BrickLoader";
import { Banner } from "../(components)/home/Banner";
import { ProductCarousel } from "../(components)/home/bestDeals";
import { ProjectShowcase } from "../(components)/home/ProjectAShowcase";
import TrustpilotSection from "../(components)/home/ReviewGroup";
import Product from "../(components)/Product";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // Start with false to match SSR

  useEffect(() => {
    setIsLoading(true); // Now trigger loading on client side
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading && <BrickLoader />}
      <Banner />
      <ProjectShowcase />
      <TrustpilotSection />
      <ProductCarousel />
      <Product />
    </div>
  );
}