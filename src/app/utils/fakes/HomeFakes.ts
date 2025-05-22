import { StaticImageData } from "next/image";
import user1 from "../../../../public/user1.jpeg"
import user2 from "../../../../public/user2.jpeg"
import user3 from "../../../../public/user3.jpeg"
import user4 from "../../../../public/user4.jpeg"


// Banner Data
export const HomeBannerSlides = [
  {
    id: 1,
    title: "Construction Services",
    subtitle: "We Provide",
    description: "Transform your vision into reality with our comprehensive construction solutions. Expert teams, quality materials, and timely delivery.Transform your vision into reality with our comprehensive construction solutions. Expert teams, quality materials, and timely delivery",
    buttonText: "View Services",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Project Management",
    subtitle: "Excellence In",
    description: "Stay on track with advanced project management tools. Real-time updates, resource allocation, and milestone tracking.Transform your vision into reality with our comprehensive construction solutions. Expert teams, quality materials, and timely delivery",
    buttonText: "Learn More",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Design Solutions",
    subtitle: "Innovative",
    description: "Cutting-edge design solutions that blend aesthetics with functionality. 3D visualization and custom planning services.Transform your vision into reality with our comprehensive construction solutions. Expert teams, quality materials, and timely delivery",
    buttonText: "Explore Designs",
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