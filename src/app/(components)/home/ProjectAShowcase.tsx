"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import storeImg from "../../../../public/store-img.jpg";
import customerImg from "../../../../public/customer.jpg";
import architectImg from "../../../../public/architect.jpg";
import { StaticImageData } from 'next/image';

interface ProjectItem {
  image: string | StaticImageData;
  name: string;
  description: string;
}

const projectItems: ProjectItem[] = [
  {
    image: storeImg,
    name: "Seller / Shop",
    description:
      "If you have a store looking forward to sell your products navigate here.",
  },
  {
    image: architectImg,
    name: "Architecture / Designer",
    description:
      "Are you an architurecture or an interior designer click here.",
  },
  {
    image: customerImg,
    name: "Customer",
    description: "Looking for a construction product or services ?",
  },
];

export const ProjectShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="py-20 bg-gradient-to-br from-gray-100 to-gray-300 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-black mb-4 text-center">
          What type of pro are you?
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Choose what client you are, so that we can help you.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {projectItems.map((item, index) => (
            <div
              key={index}
              className="group relative h-[300px] overflow-hidden cursor-pointer rounded-2xl"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out transform 
                  group-hover:scale-110"
                style={{
                  backgroundImage: `url(${typeof item.image === 'string' ? item.image : item.image.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500
                ${activeIndex === index ? "opacity-60" : "opacity-0"}`}
              />

              {/* Content */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-end
                transition-all duration-500 transform
                ${
                  activeIndex === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <div className="relative">
                  {/* Line animation */}
                  <div
                    className={`absolute -top-4 left-0 h-0.5 bg-white transition-all duration-700
                    ${activeIndex === index ? "w-16" : "w-0"}`}
                  />

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-200 mb-4 opacity-90">
                    {item.description}
                  </p>
                  {/* <Link></Link> */}
                  <button className="text-white flex items-center group/btn">
                    <span className="mr-2">View Project</span>
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
