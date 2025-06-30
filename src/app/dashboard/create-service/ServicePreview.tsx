'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/(components)/Button";

interface ServicePreviewProps {
  name: string;
  description: string;
  price: number;
}

const ServicePreview: React.FC<ServicePreviewProps> = ({ name, description, price }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="bg-white overflow-hidden w-72 m-4 shadow-lg rounded-xl">
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3"
          alt={name || "Service Image"}
          width={100}
          height={100}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-2 right-2 border rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
          <Heart className="text-white" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {name || "Service Name"}
          </h3>
          <p className="font-semibold text-lg text-yellow-400">
            {price > 0 ? `${price.toLocaleString()}` : "0"}
            <span className="text-sm"> Rwf</span>
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-2 h-10 overflow-hidden">
          {description || "Service description goes here..."}
        </p>
        <div className="flex justify-between items-center mb-3">
          <div className="text-green-500 text-sm flex items-center">⭐ 4.0</div>
          <div
            onClick={toggleDetails}
            className="cursor-pointer rounded-sm p-1 bg-gray-200 hover:bg-gray-300 transition"
          >
            {showDetails ? (
              <ChevronUp className="text-md text-gray-600" />
            ) : (
              <ChevronDown className="text-md text-gray-600" />
            )}
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p><strong>Details:</strong></p>
            <p className="break-words">{description || "No additional details provided."}</p>
          </div>
        )}
        
        <div className="flex justify-between w-full mt-4 space-x-2">
          <Button
            text={"Order a sample"}
            texSize={"text-sm"}
            hoverBg={"hover:bg-yellow-500"}
            borderCol={"border-yellow-500"}
            bgCol={"white"}
            textCol={""}
            border={"border"}
            handleButton={() => {}}
            padding={"p-3"}
            round={"rounded-md"}
          />
          <Button
            text={"Add to cart"}
            texSize={"text-sm"}
            hoverBg={"hover:bg-yellow-500"}
            borderCol={""}
            bgCol={"bg-amber-400"}
            textCol={"text-white"}
            border={""}
            handleButton={() => {}}
            padding={"p-3"}
            round={"rounded-md"}
          />
        </div>
      </div>
    </div>
  );
}

export default ServicePreview; 