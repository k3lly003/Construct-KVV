"use client";

// import { useSuseEffect } from "react";
// import { BrickLoader } from "../(components)/BrickLoader";
import { Banner } from "../(components)/home/Banner";
import { ProductCarousel } from "../(components)/home/bestDeals";
import { ProjectShowcase } from "../(components)/home/ProjectAShowcase";
import { Products } from "../(components)/Product";
import { reviewsData } from "../utils/fakes/HomeFakes";
import ReviewCarousel from "../(components)/home/ReviewCarousel";
// import TestimonialCarousel from "../(components)/home/TestimonialCarousel";

export default function Home() {
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      {/* {isLoading && <BrickLoader />} */}
      <Banner />
      <ProjectShowcase />
      {/* <TrustpilotSection /> */}
      {/* <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-3xl font-bold mb-8">What Our Clients Say</h1>
        <TestimonialCarousel />
      </div> */}
      <ReviewCarousel reviews={reviewsData} />
      <ProductCarousel />
      <Products />
    </>
  );
}
