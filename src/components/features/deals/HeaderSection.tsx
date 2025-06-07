// components/deals/HeaderSection.tsx
import React from 'react';
import { dealsHeaderData } from '@/app/utils/fakes/DealFakes'; // Adjust the import path

interface DealsHeaderProps {
  header: string;
  description: string;
}

const HeaderSection: React.FC<DealsHeaderProps> = ({ header, description }) => {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{header}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {dealsHeaderData.benefits.map((benefit, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              {benefit.icon}
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
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

export default HeaderSection;