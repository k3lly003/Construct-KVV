"use client"

import React, { useState, useEffect } from "react"
import { Store, Package, Handshake } from "lucide-react"

const supplierBenefits = [
  {
    icon: Package,
    title: "Marketplace Listing",
    description: "List products in our professional marketplace and reach thousands of construction professionals",
  },
  {
    icon: Handshake,
    title: "Direct Connections",
    description: "Connect directly with buyers and specifiers to build lasting business relationships",
  },
  {
    icon: Store,
    title: "Analytics & Tools",
    description: "Powerful analytics and sales tools to track performance and grow your business",
  },
]

export default function SupplierHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % supplierBenefits.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 min-h-[600px]">
      {/* Abstract Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="h-full w-full">
          <defs>
            <pattern id="sellerGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="none" stroke="white" strokeWidth="0.5" />
              <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="0.25" strokeDasharray="2 2" />
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sellerGrid)" />
        </svg>
      </div>

      <div className="relative px-8 py-16 h-full">
        <div className="max-w-6xl mx-auto">
          <div className="block space-y-12">
            {/* Left Column - Hero Content */}
            <div className="mb-12">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Grow Your
                <span className="block text-purple-200">Business</span>
              </h1>

              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Partner with us to supply quality materials and products to construction professionals
              </p>
            </div>

            {/* Right Column - Carousel */}
            <div className="relative">
              <div className="relative bg-black/20 backdrop-blur-md rounded-2xl p-8 text-white min-h-[300px] flex flex-col justify-center">
                {/* Carousel Content */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {React.createElement(supplierBenefits[currentSlide].icon, {
                      className: "w-8 h-8 text-white",
                    })}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{supplierBenefits[currentSlide].title}</h3>

                  <p className="text-lg text-white/90 leading-relaxed">{supplierBenefits[currentSlide].description}</p>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-8">
                  {supplierBenefits.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "bg-white" : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
