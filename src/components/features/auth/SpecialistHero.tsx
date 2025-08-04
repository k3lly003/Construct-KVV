"use client"

import React, { useState, useEffect } from "react"
import { Wrench, Zap, Cog } from "lucide-react"

const specialistBenefits = [
  {
    icon: Zap,
    title: "Specialized skill verification",
    description: "Showcase your expertise and build trust with clients through verified skills.",
  },
  {
    icon: Cog,
    title: "Technical consultation platform",
    description: "Offer your insights and solutions on a dedicated platform for technical consultations.",
  },
  {
    icon: Wrench,
    title: "Direct project matching",
    description: "Connect directly with projects that specifically need your specialized skills.",
  },
]

export default function SpecialistHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % specialistBenefits.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 min-h-[600px]">
      {/* Technical Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 40 40" className="h-full w-full">
          <defs>
            <pattern id="technical" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="4" fill="none" stroke="white" strokeWidth="0.5" />
              <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="0.25" />
              <line x1="10" y1="2" x2="10" y2="18" stroke="white" strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#technical)" />
        </svg>
      </div>

      <div className="relative px-8 py-16 h-full flex flex-col justify-center">
        {/* Main Hero Content - Remains Static */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Expert
            <span className="block text-green-200">Solutions</span>
          </h1>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Showcase your specialized skills and connect with projects that need your expertise
          </p>
        </div>

        {/* Benefits Carousel - Only this section is a carousel */}
        <div className="relative bg-black/20 backdrop-blur-md rounded-2xl p-8 text-white min-h-[200px] flex flex-col justify-center">
          {/* Carousel Content */}
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
              {React.createElement(specialistBenefits[currentSlide].icon, {
                className: "w-6 h-6 text-white",
              })}
            </div>
            <h3 className="text-xl font-bold mb-2">{specialistBenefits[currentSlide].title}</h3>
            <p className="text-base text-white/90 leading-relaxed">{specialistBenefits[currentSlide].description}</p>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {specialistBenefits.map((_, index) => (
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
