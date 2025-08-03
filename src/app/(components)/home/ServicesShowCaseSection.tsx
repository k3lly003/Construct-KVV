"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Home, Briefcase, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
// import { useTranslations } from "@/app/hooks/useTranslations"

interface ServiceCard {
  id: string
  title: string
  image: string
  link: string
}

interface NavigationTab {
  id: string
  label: string
  icon: React.ReactNode
}

interface TabContent {
  id: string
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
    icon: React.ReactNode
  }
  services: ServiceCard[]
}

const navigationTabs: NavigationTab[] = [
  { id: "home-maintenance", label: "Home Maintenance", icon: <Home className="w-4 h-4" /> },
  { id: "projects", label: "Projects", icon: <Briefcase className="w-4 h-4" /> },
  { id: "bids-bulk", label: "Bids & Bulk", icon: <DollarSign className="w-4 h-4" /> },
  { id: "hire-professional", label: "Hire a Professional", icon: <Users className="w-4 h-4" /> },
]

const tabContent: Record<string, TabContent> = {
  "home-maintenance": {
    id: "home-maintenance",
    hero: {
      title: "These annoying chores used to eat up your entire weekend. Not anymore.",
      subtitle: "See all home maintenance",
      backgroundImage: "./comp-1.webp",
      icon: <Home className="w-8 h-8 text-white" />,
    },
    services: [
      {
        id: "house-cleaning",
        title: "House Cleaning",
        image: "https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "#",
      },
      {
        id: "interior-painting",
        title: "Interior Painting",
        image: "https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "#",
      },
      {
        id: "handyman",
        title: "Handyman",
        image: "https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "#",
      },
    ],
  },
  "projects": {
    id: "projects",
    hero: {
      title: "Turn your vision into reality with our comprehensive project management.",
      subtitle: "Explore all projects",
      backgroundImage: "./comp-2.jpg",
      icon: <Briefcase className="w-8 h-8 text-white" />,
    },
    services: [
      {
        id: "kitchen-remodel",
        title: "Kitchen Remodeling",
        image: "/placeholder.svg?height=200&width=300",
        link: "#",
      },
      {
        id: "bathroom-renovation",
        title: "Bathroom Renovation",
        image: "/placeholder.svg?height=200&width=300",
        link: "#",
      },
      {
        id: "home-addition",
        title: "Home Addition",
        image: "/placeholder.svg?height=200&width=300",
        link: "#",
      },
    ],
  },
  "bids-bulk": {
    id: "bids-bulk",
    hero: {
      title: "Get competitive bids and bulk pricing for your large-scale projects.",
      subtitle: "Start bidding process",
      backgroundImage: "./deals.jpg",
      icon: <DollarSign className="w-8 h-8 text-white" />,
    },
    services: [
      {
        id: "bulk-materials",
        title: "Bulk Materials",
        image: "/placeholder.svg?height=200&width=300",
        link: "#",
      },
      {
        id: "contractor-bids",
        title: "Contractor Bids",
        image: "/placeholder.svg?height=200&width=300",
        link: "#",
      },
      {
        id: "wholesale-pricing",
        title: "Wholesale Pricing",
        image: "/placeholder.svg?height=200&width=300",
        link: "#",
      },
    ],
  },
  "hire-professional": {
    id: "hire-professional",
    hero: {
      title: "Connect with vetted professionals who deliver exceptional results.",
      subtitle: "Browse professionals",
      backgroundImage: "./house-plan.jpg",
      icon: <Users className="w-8 h-8 text-white" />,
    },
    services: [
      {
        id: "certified-contractors",
        title: "Certified Contractors",
        image: "/user1.jpeg",
        link: "#",
      },
      {
        id: "design-specialists",
        title: "Design Specialists",
        image: "/user2.jpeg",
        link: "#",
      },
      {
        id: "project-managers",
        title: "Project Managers",
        image: "/user3.jpeg",
        link: "#",
      },
    ],
  },
}

export default function ServicesShowCaseSection() {
  const [activeTab, setActiveTab] = useState("home-maintenance")
  const currentContent = tabContent[activeTab]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-6 mb-8 border-b border-gray-200">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === tab.id ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Hero Section */}
      <div className="relative mb-8 rounded-lg overflow-hidden">
        <div
          className="h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${currentContent.hero.backgroundImage}')`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900" />

          {/* Content */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-center">
            <div className="mb-4">{currentContent.hero.icon}</div>
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-4 max-w-md">{currentContent.hero.title}</h1>
            <Button
              variant="link"
              className="text-white hover:text-gray-200 p-0 h-auto font-medium text-left justify-start"
            >
              {currentContent.hero.subtitle}
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentContent.services.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[5/4] relative">
              <Image
                fill
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
              <Button
                variant="link"
                className="text-amber-600 hover:text-amber-700 p-0 h-auto font-medium flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                See pros near you
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab-specific additional content */}
      {activeTab === "projects" && (
        <div className="mt-8 p-6 bg-amber-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management Features</h3>
          <p className="text-gray-600">
            Track progress, manage timelines, and coordinate with multiple contractors all in one place.
          </p>
        </div>
      )}

      {activeTab === "bids-bulk" && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Bidding Process</h3>
          <p className="text-gray-600">
            Submit your project details and receive competitive bids from qualified contractors in your area.
          </p>
        </div>
      )}

      {activeTab === "hire-professional" && (
        <div className="mt-8 p-6 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vetted Professional Network</h3>
          <p className="text-gray-600">
            All professionals are background-checked, licensed, and have proven track records of quality work.
          </p>
        </div>
      )}
    </div>
  )
}
