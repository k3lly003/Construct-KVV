// import ServicesSection from "./_components/sections/home/ServicesSection";
// import HomePageData from "./../../utils/Fakes/homePageFakes";
// import { FetchData } from "";                                      REACT QUERY FETCHING FILE  
// import Loading from "../(dashboard-pages)/dashboard/loading";      USED IT WHEN IT COMES TO FETCHING AND CATCHING SOME ERRORS
// import { Suspense } from "react";                                  USED IT WHEN IT COMES TO FETCHING AND CATCHING SOME ERRORS

export const metadata = {
  title: "Home - Welcome to the KVV Ltd e-commerce",
  description: "Welcome to the best online construction shop in Rwanda.",
  keywords: "kvv, e-commerce, construction, real estate in Rwanda, kvv Rwanda, Rwanda, construction e-commerce, Visit Rwanda, House in Rwanda, Rent House near me, Rent House in Rwanda, Igihe, paul kagame, Gorilla in Rwanda, Shop near me",
  openGraph: {
    title: "Home - Welcome to kvv Ltd",
    description: "Welcome to the best online construction shop in Rwanda.",
    // url: "https://www.kvv.shop",
    siteName: "kvv shop",
    images: [
      {
        url: "/F9.jpeg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Home - Welcome to kvv shop",
  // "url": "https://www.kvv.shop",
  "description": "Welcome to the best and the best online construction shop in Rwanda.",
  "image": "/F8.jpeg",
  "author": {
    "@type": "Organization",
    "name": "kvv shop",
    "url": "https://www.kvv.shop",
    "image": "/F8.jpeg",
    "sameAs": [
      // ADD HANDLES
      // "https://www.youtube.com/channel/",
      // "https://www.facebook.com/",
      // "https://www.instagram.com/",
      // "https://twitter.com/"
    ]
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.kvv.shop`
  }
}

const page = async () => {

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* <ServicesSection
        servicesSectionData={HomePageData.servicesSectionData}
      /> */}
    </div>
  )
}

export default page;