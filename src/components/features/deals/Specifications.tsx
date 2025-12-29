"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SpecificationsProps } from "@/app/utils/dtos/deals.dtos";



const Specifications: React.FC<SpecificationsProps> = ({
  dimensions,
  details,
  warranty,
  resources,
}) => {
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const toggleSpecifications = () => {
    setShowSpecifications(!showSpecifications);
  };

  const toggleResources = () => {
    setShowResources(!showResources);
  };

  return (
    <div className="mb-6 flex flex-col gap-5">
      <div className="border-b pb-2 mb-2">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleSpecifications}
        >
          <h2 className="text-mid font-semibold text-yellow-400">Specifications</h2>
          {showSpecifications ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {showSpecifications && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-x-10">
            {/* Dimensions */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Dimensions</h3>
              <div className="space-y-3">
                {dimensions.map((item, index) => (
                  <div key={index} className="flex justify-between text-small text-gray-600">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Details</h3>
              <div className="space-y-3">
                {details.map((item, index) => (
                  <div key={index} className="flex justify-between text-small text-gray-600">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warranty */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Warranty</h3>
              <div className="space-y-3">
                {warranty.map((item, index) => (
                  <div key={index} className="flex justify-between text-small text-gray-600">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-b pb-2">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleResources}
        >
          <h2 className="text-mid font-semibold text-yellow-400">
            Warranty, Installation & Other Resources
          </h2>
          {showResources ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {showResources && (
          <div className="mt-4 space-y-2 text-small text-gray-600">
            {resources.map((item, index) => (
              <div key={index} className="flex items-center">
                {/* You might want to use an icon here, like a document or PDF */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 0010.5 3h-6.75a3.375 3.375 0 00-3.375 3.375v13.5a3.375 3.375 0 003.375 3.375h6.75a1.125 1.125 0 011.125 1.125v1.5a3.375 3.375 0 003.375-3.375h1.5a3.375 3.375 0 003.375-3.375V14.25m-8.25 0h6"
                  />
                </svg>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Specifications;