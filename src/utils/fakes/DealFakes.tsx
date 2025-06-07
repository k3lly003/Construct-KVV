import { ShieldCheck, TrendingUp, Truck } from "lucide-react";
import { ReactNode } from 'react';

interface Benefit {
  backgroundImage: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export const dealsHeaderData = {
  backgroundImage: "./customer.jpg",
  title:"Deals & Bids",
  header: "Bulk Deals & Custom Quotes",
  description: "Get competitive prices on bulk orders and custom requirements. Compare market rates and negotiate deals directly.",
  benefits: [
    {
      icon: <TrendingUp className="h-6 w-6 text-yellow-500" />,
      title: "Competitive Pricing",
      description:
        "Get below-market rates for bulk orders with our volume-based pricing model",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-yellow-500" />,
      title: "Quality Assured",
      description:
        "All products are certified and comply with international quality standards",
    },
    {
      icon: <Truck className="h-6 w-6 text-yellow-500" />,
      title: "Flexible Delivery",
      description:
        "Custom delivery schedules and nationwide logistics support available",
    },
  ] as Benefit[],
};