"use client"

import React, { useState, useEffect } from 'react';
import { Users, HardHat, Compass, Building2, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: "Construction Manpower",
    description: "Access skilled construction workers, from laborers to specialized craftsmen, all vetted and ready to work",
    bgColor: "bg-amber-500",
    buttonText: "Hire Workers",
    hoverColor: "hover:bg-amber-600",
    action: () => console.log("Hire workers clicked"),
    bgImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
  },
  {
    title: "Engineering Excellence",
    description: "Connect with certified engineers specializing in structural, electrical, and mechanical systems",
    bgColor: "bg-blue-500",
    buttonText: "Find Engineers",
    hoverColor: "hover:bg-blue-600",
    action: () => console.log("Find engineers clicked"),
    bgImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80"
  },
  {
    title: "Design Consultation",
    description: "Work with experienced architects and interior designers to bring your vision to life",
    bgColor: "bg-purple-500",
    buttonText: "Meet Designers",
    hoverColor: "hover:bg-purple-600",
    action: () => console.log("Meet designers clicked"),
    bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
  }
];

export const DesignConsultationModern: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <div className="w-full bg-gradient-to-br py-16 relative overflow-hidden border">
          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="relative h-[320px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    index === currentSlide
                      ? 'translate-x-0 opacity-100'
                      : index < currentSlide
                      ? '-translate-x-full opacity-0'
                      : 'translate-x-full opacity-0'
                  }`}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.bgImage})` }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{slide.title}</h3>
                    <p className="text-gray-600 mb-8">{slide.description}</p>
                    
                    {/* Slide-specific button */}
                    <button
                      onClick={slide.action}
                      className={`${slide.bgColor} ${slide.hoverColor} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center w-full group shadow-lg`}
                    >
                      {slide.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
                  }`}
                  onClick={() => handleSlideClick(index)}
                />
              ))}
            </div>
          </div>
    </div>
  );
};