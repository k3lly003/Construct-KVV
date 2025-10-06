"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { HomeBannerSlides } from "@/app/utils/fakes/HomeFakes";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HomeBannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = HomeBannerSlides[currentSlide];

  return (
    <div className="relative h-[700px] w-[100vw] overflow-hidden bg-gradient-to-b from-gray-900 to-gray-900">
      {currentSlideData?.image && (
        <div className="absolute inset-0 ">
          <Image
            src={currentSlideData.image} // Do NOT wrap image URL with t()
            alt={t(currentSlideData.titleKey)} // Translate alt text
            className="w-full h-full object-cover opacity-30"
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-opacity-20"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-start px-5 h-full">
        <div className="max-w-7xl flex flex-col justify-start p-5">
          {currentSlideData?.subtitleKey && (
            <span className="text-yellow-500 text-xl font-semibold mb-2 block">
              {t(currentSlideData.subtitleKey)}
            </span>
          )}
          {currentSlideData?.titleKey && (
            <h2 className="text-green-500 text-7xl font-bold mb-4 px-5">
              {t(currentSlideData.titleKey)}
            </h2>
          )}
          {currentSlideData?.descriptionKey && (
            <p className="text-gray-100 text-2xl mb-6">
              {t(currentSlideData.descriptionKey)}
            </p>
          )}
          {currentSlideData?.buttonTextKey && (
            <button className="inline-flex items-center bg-yellow-500 text-gray-900 text-lg px-5 py-2 rounded-md font-semibold hover:bg-yellow-400 transition-colors w-fit">
              {t(currentSlideData.buttonTextKey)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {HomeBannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-yellow-500 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
