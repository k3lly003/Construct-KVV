"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Play, ArrowDown, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HomeBannerSlides } from "@/app/utils/fakes/HomeFakes"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { t } = useTranslation()
  const router = useRouter()
  const totalSlides = HomeBannerSlides.length

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [totalSlides])

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    const searchParams = new URLSearchParams({
      q: searchQuery
    })
    
    // Route based on selected category
    if (selectedCategory === "service") {
      router.push(`/services?${searchParams.toString()}`)
    } else if (selectedCategory === "portfolio") {
      router.push(`/portfolios?${searchParams.toString()}`)
    } else {
      // Default to product for "all" or "product"
      router.push(`/product?${searchParams.toString()}`)
    }
  }

  const slide = HomeBannerSlides[currentSlide]

  return (
    <section className="relative h-screen w-full overflow-hidden mb-2">
      {/* Background Image with transition */}
      <div className="absolute inset-0 z-0">
        {HomeBannerSlides.map((slideItem, index) => (
          <div
            key={slideItem.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slideItem.image}
                alt={t(slideItem.titleKey)}
                fill
                priority={index === currentSlide}
                quality={90}
                className="object-cover"
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40 z-20" />
      </div>

      {/* Content */}
      <div className="relative z-30 flex h-full flex-col justify-end px-4 py-6 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 lg:gap-10 pb-8 lg:pb-16 w-full lg:w-[90%] xl:w-[80%] mx-auto">
          {/* left Content */}
          <div className="flex flex-col gap-8 max-w-3xl">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="w-fit bg-white/95 text-foreground hover:bg-white gap-2 px-4 py-2 text-sm font-normal backdrop-blur-sm"
            >
              {t(slide.subtitleKey)}
              <Link href="/about">
                <button className="flex items-center gap-1 font-medium hover:gap-2 transition-all">
                  Read more
                  <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
            </Badge>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-bold text-white leading-tight text-balance">
                {t(slide.titleKey)}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                {t(slide.descriptionKey)}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
              {/* Category Selector */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-6 py-3 bg-white text-gray-900 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-semibold shadow-lg cursor-pointer hover:border-primary/50 transition-all pr-10"
                >
                  <option value="all">All Categories</option>
                  <option value="product">Products</option>
                  <option value="service">Services</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Search Input */}
              <div className="flex-1 flex items-center bg-white rounded-full shadow-lg border-2 border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden w-full">
                <Search className="ml-4 w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search products or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 bg-transparent border-0 focus:ring-0 text-gray-900 placeholder:text-gray-500 text-sm font-medium"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 rounded-full mx-1"
                >
                  Search
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* right Content Video Card - Hidden on mobile */}
          <div className="hidden lg:flex flex-col items-end gap-6">
            {/* Video Preview Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    /{String(currentSlide + 1).padStart(2, '0')}
                    <span className="text-muted-foreground text-lg">/{String(totalSlides).padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(slide.descriptionKey)}
                  </p>
                </div>
                <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-primary/10">
                  <Image
                    src={slide.image}
                    fill
                    alt="Video thumbnail"
                    className="object-cover"
                    sizes="96px"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="rounded-full bg-white p-2">
                      <Play className="h-4 w-4 text-primary fill-primary" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {HomeBannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 w-1.5 hover:bg-white/75"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

        {/* Get in Touch Circular Badge - Repositioned for mobile */}
      {/* <Link href="/contact" className="absolute bottom-0 right-4 lg:right-8 transform translate-y-1/2 z-30 block scale-75 lg:scale-100">
        <button className="flex items-center justify-center w-32 h-32 rounded-full border-5 border-white bg-gray-900 text-white hover:bg-gray-800 shadow-2xl transition-all hover:scale-105 group">
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
              <path id="circlePath" d="M 64, 64 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" fill="none" />
              <text className="text-[11px] fill-white font-medium tracking-wider">
                <textPath href="#circlePath" startOffset="0%">
                  GET IN TOUCH • GET IN TOUCH •
                </textPath>
              </text>
            </svg>
            <ArrowDown className="h-6 w-6 group-hover:translate-y-1 transition-transform" />
          </div>
        </button>
      </Link> */}
    </section>
  )
}
export default HeroSection;
