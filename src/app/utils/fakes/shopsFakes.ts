import { StaticImageData } from "next/image";
import comp1 from "../../../../public/comp-1.webp";
import comp2 from "../../../../public/comp-2.jpg";
import comp3 from "../../../../public/comp3.webp";

export interface Profile {
  id: string;
  name: string;
  title: string;
  rating: number;
  location?: string;
  since: string;
  imageSrc: StaticImageData | string;
  category: string;
  serviceCost?: number;
}

export const profilesFakes: Profile[] = [
  {
    id: "1",
    name: "Apex Builders Ltd.",
    title:
      "Specializing in high-rise commercial building construction and infrastructure development.",
    rating: 4.7,
    location: "Kigali",
    since: "2019",
    imageSrc: comp2,
    category: "Commercial Construction",
    serviceCost: 50000,
  },
  {
    id: "2",
    name: "Solid Foundations Inc.",
    title:
      "Providing expert residential construction services, from custom homes to renovations.",
    rating: 4.9,
    location: "Musanze",
    since: "2020",
    imageSrc: comp1,
    category: "Residential Construction",
    serviceCost: 25000,
  },
  {
    id: "3",
    name: "Urban Structures Co.",
    title:
      "Focused on sustainable construction practices for both residential and commercial projects.",
    rating: 4.6,
    location: "Nyaruguru",
    since: "2021",
    imageSrc: comp3,
    category: "Mixed Use Development",
    serviceCost: 35000,
  },
  {
    id: "4",
    name: "Precision Civil Works",
    title:
      "Experts in excavation, land development, and all aspects of civil engineering projects.",
    rating: 4.8,
    location: "Rusizi",
    since: "2022",
    imageSrc: comp1,
    category: "Civil Engineering",
    serviceCost: 60000,
  },
  {
    id: "5",
    name: "Elite Roofing Solutions",
    title:
      "Offering comprehensive roofing services including installation, repair, and maintenance for all roof types.",
    rating: 4.5,
    location: "Nyamagabe",
    since: "2022",
    imageSrc: comp2,
    category: "Roofing",
    serviceCost: 15000,
  },
  {
    id: "6",
    name: "GreenBuild Constructions",
    title:
      "Dedicated to eco-friendly building solutions and the use of sustainable materials.",
    rating: 4.7,
    location: "Kigali",
    since: "2022",
    imageSrc: comp1,
    category: "Eco-Friendly Construction",
    serviceCost: 40000,
  },
  {
    id: "7",
    name: "Master Paving Group",
    title:
      "Specialists in asphalt and concrete paving for driveways, parking lots, and roadways.",
    rating: 4.9,
    location: "Kigali",
    since: "2022",
    imageSrc: comp2,
    category: "Paving",
    serviceCost: 30000,
  },
  {
    id: "8",
    name: "Ironclad Steel Erectors",
    title:
      "Providing professional steel frame erection services for industrial and commercial buildings.",
    rating: 4.6,
    location: "Nyanza",
    since: "2022",
    imageSrc: comp3,
    category: "Steel Erection", 
    serviceCost: 60000,
  },
  {
    id: "9",
    name: "AquaTech Plumbing & Piping",
    title:
      "Offering complete plumbing and piping solutions for new constructions and renovations.",
    rating: 4.8,
    location: "Musanze",
    since: "2022",
    imageSrc: comp2,
    category: "Plumbing",
    serviceCost: 10000,
  },
  {
    id: "10",
    name: "BrightLine Electrical",
    title:
      "Providing comprehensive electrical services for residential, commercial, and industrial construction projects.",
    rating: 4.7,
    location: "Rusizi",
    since: "2022",
    imageSrc: comp1,
    category: "Electrical",
    serviceCost: 12000,
  },
];
