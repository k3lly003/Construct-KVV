import { StaticImageData } from "next/image";
import user1 from "../../../../public/user1.jpeg"
import user2 from "../../../../public/user2.jpeg"
import user3 from "../../../../public/user3.jpeg"
import user4 from "../../../../public/user4.jpeg"

export interface HomeBannerSlide {
  id: number;
  image: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  buttonTextKey?: string;
}

export const HomeBannerSlides: HomeBannerSlide[] = [
  {
    id: 1,
    image: "/comp-1.webp",
    titleKey: "home.banner.title.design",
    subtitleKey: "home.banner.subtitle.innovative",
    descriptionKey: "home.banner.description.design_solutions"
  },
  {
    id: 2,
    image: "/comp-2.jpg",
    titleKey: "home.banner.title.build",
    subtitleKey: "home.banner.subtitle.precision",
    descriptionKey: "home.banner.description.construction_excellence"
  },
  {
    id: 3,
    image: "/comp3.webp",
    titleKey: "home.banner.title.renovate",
    subtitleKey: "home.banner.subtitle.transform",
    descriptionKey: "home.banner.description.modern_upgrades"
  },
  {
    id: 4,
    image: "/planB.jpg",
    titleKey: "home.banner.title.plan",
    subtitleKey: "home.banner.subtitle.dream",
    descriptionKey: "home.banner.description.custom_designs"
  }
]

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