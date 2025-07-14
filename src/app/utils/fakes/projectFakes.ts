import storeImg from "../../../../public/store-img.jpg";
import customerImg from "../../../../public/customer.jpg";
import architectImg from "../../../../public/architect.jpg";
import { StaticImageData } from 'next/image';

interface ProjectItem {
  image: string | StaticImageData;
  name: string;
  description: string;
}

// Usage: Use t(item.titleKey), t(item.descriptionKey), t(item.buttonKey) for i18n
export const projectItems = [
  {
    image: storeImg,
    titleKey: "ProjectShowcase.seller.title",
    descriptionKey: "ProjectShowcase.seller.description",
    buttonKey: "ProjectShowcase.seller.button",
  },
  {
    image: architectImg,
    titleKey: "ProjectShowcase.architect.title",
    descriptionKey: "ProjectShowcase.architect.description",
    buttonKey: "ProjectShowcase.architect.button",
  },
  {
    image: customerImg,
    titleKey: "ProjectShowcase.customer.title",
    descriptionKey: "ProjectShowcase.customer.description",
    buttonKey: "ProjectShowcase.customer.button",
  },
];

export const projectBudget = {
  total: 50000000, // RWF
  spent: 32500000, // RWF
  currency: "RWF",
};

export const projectMilestones = [
  {
    name: "Foundation",
    status: "Completed",
    progress: 100,
    date: "2024-06-15",
  },
  { name: "Framing", status: "In Progress", progress: 60, date: "2024-07-10" },
  { name: "Roofing", status: "Pending", progress: 0, date: "2024-08-01" },
];

export const projectTimeline = [
  { label: "Start", date: "2024-06-01" },
  { label: "Foundation Complete", date: "2024-06-15" },
  { label: "Framing Complete", date: "2024-07-10" },
  { label: "Estimated Finish", date: "2024-09-30" },
];

export const projectExpenses = [
  {
    amount: 6000000,
    description: "Cement for foundation",
    stage: "Foundation",
  },
  {
    amount: 4500000,
    description: "Steel bars and rebar",
    stage: "Foundation",
  },
  {
    amount: 8000000,
    description: "Lumber and framing labor",
    stage: "Framing",
  },
  {
    amount: 5000000,
    description: "Roof trusses and installation",
    stage: "Roofing",
  },
  {
    amount: 3250000,
    description: "Electrical wiring and panels",
    stage: "Framing",
  },
  {
    amount: 3000000,
    description: "Waterproofing and insulation",
    stage: "Roofing",
  },
];

