"use client"

import type React from "react"

import { useState } from "react"
import { Hammer, Package, PenTool, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface NavigationTab {
  id: string
  label: string
  icon: React.ReactNode
}

interface RoleFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface TabContent {
  id: string
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage: string
    icon: React.ReactNode
  }
  features: RoleFeature[]
  benefits: string[]
}

const navigationTabs: NavigationTab[] = [
  { id: "constructor", label: "Constructor", icon: <Hammer className="w-4 h-4" /> },
  { id: "supplier", label: "Supplier", icon: <Package className="w-4 h-4" /> },
  { id: "architect", label: "Architect", icon: <PenTool className="w-4 h-4" /> },
]

const tabContent: Record<string, TabContent> = {
  constructor: {
    id: "constructor",
    hero: {
      title: "Build Your Construction Business",
      subtitle: "Join as a Constructor",
      description:
        "Connect with clients, manage projects, and grow your construction business with our comprehensive platform.",
      backgroundImage: "/placeholder.svg?height=400&width=800",
      icon: <Hammer className="w-8 h-8 text-black" />,
    },
    features: [
      {
        id: "project-management",
        title: "Project Management",
        description: "Manage multiple construction projects, track progress, and coordinate with teams efficiently.",
        icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      },
      {
        id: "client-connection",
        title: "Client Connection",
        description: "Connect directly with property owners and businesses looking for construction services.",
        icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      },
      {
        id: "bid-opportunities",
        title: "Bid Opportunities",
        description: "Access exclusive bidding opportunities and compete for high-value construction projects.",
        icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      },
    ],
    benefits: [
      "Access to verified project leads",
      "Professional project management tools",
      "Secure payment processing",
      "24/7 customer support",
      "Mobile app for on-site management",
    ],
  },
  supplier: {
    id: "supplier",
    hero: {
      title: "Supply Materials to Growing Projects",
      subtitle: "Join as a Supplier",
      description: "Connect with contractors and architects, manage inventory, and expand your supply business reach.",
      backgroundImage: "/placeholder.svg?height=400&width=800",
      icon: <Package className="w-8 h-8 text-black" />,
    },
    features: [
      {
        id: "inventory-management",
        title: "Inventory Management",
        description: "Track your inventory, manage stock levels, and automate reordering processes.",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      },
      {
        id: "bulk-orders",
        title: "Bulk Order Processing",
        description: "Handle large-scale orders from contractors and manage delivery schedules efficiently.",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      },
      {
        id: "network-expansion",
        title: "Network Expansion",
        description: "Connect with contractors and architects across your region to expand your business network.",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      },
    ],
    benefits: [
      "Direct access to contractors and architects",
      "Automated inventory tracking",
      "Bulk order management system",
      "Competitive pricing tools",
      "Logistics and delivery coordination",
    ],
  },
  architect: {
    id: "architect",
    hero: {
      title: "Design and Collaborate on Amazing Projects",
      subtitle: "Join as an Architect",
      description: "Showcase your designs, collaborate with contractors, and bring architectural visions to life.",
      backgroundImage: "/placeholder.svg?height=400&width=800",
      icon: <PenTool className="w-8 h-8 text-black" />,
    },
    features: [
      {
        id: "design-showcase",
        title: "Design Portfolio",
        description: "Create a stunning portfolio to showcase your architectural designs and past projects.",
        icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      },
      {
        id: "collaboration-tools",
        title: "Collaboration Tools",
        description: "Work seamlessly with contractors and clients using integrated design and communication tools.",
        icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      },
      {
        id: "project-visualization",
        title: "3D Visualization",
        description: "Present your designs with advanced 3D visualization and virtual reality capabilities.",
        icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      },
    ],
    benefits: [
      "Professional portfolio hosting",
      "Advanced design collaboration tools",
      "3D modeling and visualization",
      "Client project management",
      "Industry networking opportunities",
    ],
  },
}

export default function RoleSignupSection() {
  const [activeTab, setActiveTab] = useState("constructor")
  const currentContent = tabContent[activeTab]

  const handleRegister = (role: string) => {
    // This would typically navigate to a registration form
    console.log(`Registering as ${role}`)
    // You can implement navigation to registration form here
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 w-[12%] text-gray-600 hover:text-gray-900 mb-4 border p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">Back home</span>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Professional Network</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your role and start connecting with industry professionals to grow your business
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 border-b border-gray-200">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
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

          {/* Content */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-center">
            <div className="mb-4">{currentContent.hero.icon}</div>
            <h2 className="text-black text-2xl md:text-3xl font-bold mb-4 max-w-md">{currentContent.hero.title}</h2>
            <p className="text-black text-lg mb-6 max-w-lg">{currentContent.hero.description}</p>
            <Button
              onClick={() => handleRegister(activeTab)}
              className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 w-fit"
            >
              {currentContent.hero.subtitle}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentContent.features.map((feature) => (
          <Card key={feature.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What You Get as a {navigationTabs.find((tab) => tab.id === activeTab)?.label}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentContent.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button
            onClick={() => handleRegister(activeTab)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-black px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            Get Started as a {navigationTabs.find((tab) => tab.id === activeTab)?.label}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
