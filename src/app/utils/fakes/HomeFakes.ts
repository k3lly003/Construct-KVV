import { StaticImageData } from "next/image";
import user1 from "../../../../public/user1.jpeg"
import user2 from "../../../../public/user2.jpeg"
import user3 from "../../../../public/user3.jpeg"
import user4 from "../../../../public/user4.jpeg"


// Banner Data
export const HomeBannerSlides = [
  {
    id: 1,
    titleKey: "banner.slide1.title",
    subtitleKey: "banner.slide1.subtitle",
    descriptionKey: "banner.slide1.description",
    buttonTextKey: "banner.slide1.buttonText",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    titleKey: "banner.slide2.title",
    subtitleKey: "banner.slide2.subtitle",
    descriptionKey: "banner.slide2.description",
    buttonTextKey: "banner.slide2.buttonText",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    titleKey: "banner.slide3.title",
    subtitleKey: "banner.slide3.subtitle",
    descriptionKey: "banner.slide3.description",
    buttonTextKey: "banner.slide3.buttonText",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
  },
];


export interface Review {
  id: number;
  name: string;
  quote: string;
  image: string | StaticImageData;
  affiliation?: string;
  rating?: number;
}

export const reviewsData: Review[] = [
  {
    name: "Eng. Aisha K.",
    image: user1,
    quote: "FADA's support was life-changing. They truly care about the well-being of women.",
    affiliation: "Engineer",
    id: 1
  },
  {
    name: "Ben M.",
    image: user2,
    quote: "The resources and advocacy provided by FADA are invaluable to our community.",
    affiliation: "Community Leader",
    id: 2
  },
  {
    name: "Aiko weseal",
    image: user3,
    quote: "FADA's support was life-changing. They truly care about the well-being of women.",
    affiliation: "Directing Manager at NPD",
    id: 3
  },
  {
    name: "Mugisha Murashi.",
    image: user4,
    quote: "The resources and advocacy provided by FADA are invaluable to our community.",
    affiliation: "CEO at Rwanda Stell",
    id: 4
  },
  {
    name: "Musoni Gaddy K.",
    image: user2,
    quote: "FADA's support was life-changing. They truly care about the well-being of women.",
    affiliation: "Co-Founder at Murenzi Real Estate & Co",
    id: 5
  },
  {
    name: "Benjamin",
    image: user3,
    quote: "The resources and advocacy provided by FADA are invaluable to our community.",
    affiliation: "Community Leader",
    id: 6
  },
  {
    name: "Malaika K.",
    image: user4,
    quote: "FADA's support was life-changing. They truly care about the well-being of women.",
    id: 7
  },
  {
    name: "Karim Benzema.",
    image: user2,
    quote: "The resources and advocacy provided by FADA are invaluable to our community.",
    affiliation: "Minister of Finance",
    id: 8
  },
];