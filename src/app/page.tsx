// import Image from "next/image";
import { Banner } from "./(components)/home/Banner";
import ProductCarousel from "./(components)/home/bestDeals";
import { ProjectShowcase } from "./(components)/home/ProjectAShowcase"
import TrustpilotSection from "./(components)/home/ReviewGroup";
import Product from "./(components)/Product";
// import { DesignConsultationModern } from "./Consultation";


export default function Home() {
  return (
    <div>
        <Banner/>
        {/* <DesignConsultationModern/> */}
        <ProjectShowcase/>
        <TrustpilotSection />
        < ProductCarousel />
        <Product />
    </div>
  );
}
