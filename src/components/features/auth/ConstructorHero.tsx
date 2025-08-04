"use client"

import React, { useState, useEffect } from "react"
import { HardHat, Hammer, Truck } from "lucide-react"

const constructorBenefits = [
  {
    icon: Hammer,
    title: "Project management dashboard",
    description: "Streamline your projects with an intuitive dashboard for planning and tracking.",
  },
  {
    icon: Truck,
    title: "Resource & equipment tracking",
    description: "Efficiently manage and track all your resources and equipment in one place.",
  },
  {
    icon: HardHat,
    title: "Contractor network access",
    description: "Gain access to a vast network of top contractors for your ambitious projects.",
  },
]

export default function ConstructorHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % constructorBenefits.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-red-600 min-h-[600px]">
      {/* Industrial Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 60 60" className="h-full w-full">
          <defs>
            <pattern id="construction" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="none" stroke="white" strokeWidth="1" />
              <rect x="7.5" y="7.5" width="15" height="15" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="15" cy="15" r="3" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#construction)" />
        </svg>
      </div>

      <div className="relative px-8 py-16 h-full flex flex-col justify-center">
        {/* Main Hero Content - Remains Static */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <HardHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Build with
            <span className="block text-orange-200">Confidence</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Connect with top contractors and bring ambitious projects to life
          </p>
        </div>

        {/* Benefits Carousel - Only this section is a carousel */}
        <div className="relative bg-black/20 backdrop-blur-md rounded-2xl p-8 text-white min-h-[200px] flex flex-col justify-center">
          {/* Carousel Content */}
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
              {React.createElement(constructorBenefits[currentSlide].icon, {
                className: "w-6 h-6 text-white",
              })}
            </div>
            <h3 className="text-xl font-bold mb-2">{constructorBenefits[currentSlide].title}</h3>
            <p className="text-base text-white/90 leading-relaxed">{constructorBenefits[currentSlide].description}</p>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {constructorBenefits.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}