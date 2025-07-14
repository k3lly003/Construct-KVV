"use client";

// import { BrickLoader } from "../(components)/BrickLoader";
import { Banner } from "@/app/(components)/home/Banner";
import { ProductCarousel } from "@/app/(components)/home/bestDeals";
import { ProjectShowcase } from "@/app/(components)/home/ProjectShowcase";
import { Products } from "@/app/(components)/Product";
// import { reviewsData } from "../utils/fakes/HomeFakes";
// import ReviewCarousel from "../(components)/home/ReviewCarousel";

export default function Home() {

  return (
    <>
      <Banner />
      <ProjectShowcase />
      {/* UN-COMMENT THIS REVIEW ONCE THE TOOL HAVE GOME MANY REVIEW */}
      {/* <ReviewCarousel reviews={reviewsData} /> */}
      <ProductCarousel />
      <Products />
    </>
  );
}
