import { ShieldCheck, TrendingUp, Truck } from "lucide-react";
import React from "react";

const BenefitsSection = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          {
            icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
            title: "Competitive Pricing",
            description:
              "Get below-market rates for bulk orders with our volume-based pricing model",
          },
          {
            icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
            title: "Quality Assured",
            description:
              "All products are certified and comply with international quality standards",
          },
          {
            icon: <Truck className="h-6 w-6 text-blue-500" />,
            title: "Flexible Delivery",
            description:
              "Custom delivery schedules and nationwide logistics support available",
          },
        ].map((benefit, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              {benefit.icon}
              <h3 className="ml-3 text-mid font-semibold text-gray-900">
                {benefit.title}
              </h3>
            </div>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default BenefitsSection;
