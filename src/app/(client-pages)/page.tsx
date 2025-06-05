"use client";

// import { BrickLoader } from "../(components)/BrickLoader";
import { Banner } from "../(components)/home/Banner";
import { ProductCarousel } from "../(components)/home/bestDeals";
import { ProjectShowcase } from "../(components)/home/ProjectAShowcase";
import { Products } from "../(components)/Product";
// import { reviewsData } from "../utils/fakes/HomeFakes";
// import ReviewCarousel from "../(components)/home/ReviewCarousel";

export default function Home() {
  // const [isLoading, setIsLoading] = useState(false);

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
