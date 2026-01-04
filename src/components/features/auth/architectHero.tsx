"use client"

import React, { useState, useEffect } from "react"
import { Building2, Ruler, PenTool } from "lucide-react"

const architectBenefits = [
  {
    icon: PenTool,
    title: "Advanced Design Tools",
    description: "Collaborate seamlessly with advanced design and visualization tools.",
  },
  {
    icon: Building2,
    title: "Portfolio Showcase",
    description: "Display your architectural masterpieces in a professional portfolio.",
  },
  {
    icon: Ruler,
    title: "Professional Network",
    description: "Connect with industry leaders and find new opportunities.",
  },
]

export default function ArchitectHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % architectBenefits.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 min-h-[600px]">
      {/* Blueprint Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <pattern id="blueprint" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="white" strokeWidth="0.5"/>
              <line x1="0" y1="10" x2="20" y2="10" stroke="white" strokeWidth="0.25"/>
              <line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="0.25"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint)"/>
        </svg>
      </div>
      
      <div className="relative px-8 py-16 h-full flex flex-col justify-center">
        {/* Main Hero Content - Remains Static */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-title md:text-title font-bold text-white mb-4 leading-tight">
            Design the
            <span className="block text-teal-200">Future</span>
          </h1>
          
          <p className="text-mid text-blue-100 mb-8 leading-relaxed">
            Join a community of visionary architects shaping tomorrow&apos;s built environment
          </p>
        </div>

        {/* Benefits Carousel */}
        <div className="relative bg-black/20 backdrop-blur-md rounded-2xl p-8 text-white min-h-[200px] flex flex-col justify-center">
          {/* Carousel Content */}
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
              {React.createElement(architectBenefits[currentSlide].icon, {
                className: "w-6 h-6 text-white",
              })}
            </div>
            <h3 className="text-mid font-bold mb-2">{architectBenefits[currentSlide].title}</h3>
            <p className="text-base text-white/90 leading-relaxed">{architectBenefits[currentSlide].description}</p>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {architectBenefits.map((_, index) => (
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