"use client";

import { useState, useEffect } from "react";
import { BrickLoader } from "../(components)/BrickLoader";
import { Banner } from "../(components)/home/Banner";
import { ProductCarousel } from "../(components)/home/bestDeals";
import { ProjectShowcase } from "../(components)/home/ProjectAShowcase";
import TrustpilotSection from "../(components)/home/ReviewGroup";
import {Products} from "../(components)/Product";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <BrickLoader />}
      <Banner />
      <ProjectShowcase />
      <TrustpilotSection />
      <ProductCarousel />
      <Products/>
    </>
  );
}