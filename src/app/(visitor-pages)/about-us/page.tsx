import AboutPageFakes from "@/utils/aboutPageFakes";
import { openGraphImage } from '../../shared-metadata';
import DefaultPageBanner from "../_components/DefaultPageBanner";
import PageTitle from "../_components/PageTitle";
import HistoricalBackground from "../_components/sections/about-us/HistoricalBackground";
import VisionMission from "../_components/sections/about-us/VisionMission";
import CoreValues from "../_components/sections/about-us/CoreValues";

export const metadata = {
  title: "About us",
  description: "Learn more about construction kvv. Historical Background, Mission, Vision and Values of construction kvv.",
  keywords: "About kvv, Kvv, About e-commerce, About construction, real estate in Rwanda, About kvv Rwanda, Rwanda, About construction e-commerce, Visit Rwanda, About House in Rwanda, About Rent House near me, About Rent House in Rwanda, About Shop near me",
  openGraph: {
    title: "About us",
    description: "Learn more about construction kvv. Historical Background, Mission, Vision and Values of construction kvv.",
    ...openGraphImage,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "About us",
  "url": "https://www.kvv.shop/about-us",
  "description": "Learn more about construction kvv. Historical Background, Mission, Vision and Values of construction kvv.",
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
    "@id": `https://www.kvv.shop/about-us`
  }
}

const page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DefaultPageBanner
        backgroundImage={AboutPageFakes.backgroundImage}
        title={AboutPageFakes.title}
        description={AboutPageFakes.titleDescription}
        hasButton={false}
      />
      <PageTitle
        orientation={"center"}
        title={AboutPageFakes.subTitle}
      />
      <HistoricalBackground
        historicalBackground={AboutPageFakes.historicalBackground}
      />
      <VisionMission
        vision={AboutPageFakes.vision}
        mission={AboutPageFakes.mission}
      />
      <CoreValues
        values={AboutPageFakes.values}
      />
    </>
  )
}

export default page