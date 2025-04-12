// import Image from "next/image";
import { Banner } from "./(components)/home/Banner";
import ProductCarousel from "./(components)/home/bestDeals";
import { ProjectShowcase } from "./(components)/home/ProjectAShowcase"
import TrustpilotSection from "./(components)/home/ReviewGroup";
import Product from "./(components)/Product";
import { DesignConsultationModern } from "./Consultation";


export default function Home() {
  return (
    <div>
        <Banner/>
        {/* <DesignConsultationModern/> */}
        <ProjectShowcase/>
        <TrustpilotSection />
        < ProductCarousel />
        <Product imageSrc={"https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=300"} rating={4} price={100000} name={"Boots"} />
    </div>
  );
}
