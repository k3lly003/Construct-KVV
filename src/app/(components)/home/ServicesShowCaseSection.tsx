"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Home, Briefcase, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslation } from "react-i18next"

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
  { id: "home-maintenance", label: "home.maintenanceLabel", icon: <Home className="w-4 h-4" /> },
  { id: "projects", label: "home.projects", icon: <Briefcase className="w-4 h-4" /> },
  { id: "bids-bulk", label: "home.bidsBulk", icon: <DollarSign className="w-4 h-4" /> },
  { id: "hire-professional", label: "home.hireProfessional", icon: <Users className="w-4 h-4" /> },
]

const tabContent: Record<string, TabContent> = {
  "home-maintenance": {
    id: "home-maintenance",
    hero: {
      title: "home.maintenance.hero.title",
      subtitle: "home.maintenance.hero.subtitle",
      backgroundImage: "./comp-1.webp",
      icon: <Home className="w-8 h-8 text-white" />,
    },
    services: [
      {
        id: "house-cleaning",
        title: "home.maintenance.services.houseCleaning",
        image: "https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "#",
      },
      {
        id: "interior-painting",
        title: "home.maintenance.services.interiorPainting",
        image: "https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "#",
      },
      {
        id: "handyman",
        title: "home.maintenance.services.handyman",
        image: "https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "#",
      },
    ],
  },
     "projects": {
     id: "projects",
     hero: {
       title: "home.project-contents.hero.title",
       subtitle: "home.project-contents.hero.subtitle",
       backgroundImage: "./comp-2.jpg",
       icon: <Briefcase className="w-8 h-8 text-white" />,
     },
    services: [
             {
         id: "kitchen-remodel",
         title: "home.project-contents.services.kitchenRemodel",
         image: "/placeholder.svg?height=200&width=300",
         link: "#",
       },
             {
         id: "bathroom-renovation",
         title: "home.project-contents.services.bathroomRenovation",
         image: "/placeholder.svg?height=200&width=300",
         link: "#",
       },
       {
         id: "home-addition",
         title: "home.project-contents.services.homeAddition",
         image: "/placeholder.svg?height=200&width=300",
         link: "#",
       },
    ],
  },
     "bids-bulk": {
     id: "bids-bulk",
     hero: {
       title: "home.bidsBulk-contents.hero.title",
       subtitle: "home.bidsBulk-contents.hero.subtitle",
       backgroundImage: "./deals.jpg",
       icon: <DollarSign className="w-8 h-8 text-white" />,
     },
    services: [
             {
         id: "bulk-materials",
         title: "home.bidsBulk-contents.services.bulkMaterials",
         image: "/placeholder.svg?300",
         link: "#",
       },
       {
         id: "contractor-bids",
         title: "home.bidsBulk-contents.services.contractorBids",
         image: "/placeholder.svg?300",
         link: "#",
       },
       {
         id: "wholesale-pricing",
         title: "home.bidsBulk-contents.services.wholesalePricing",
         image: "/placeholder.svg?300",
         link: "#",
       },
    ],
  },
     "hire-professional": {
     id: "hire-professional",
     hero: {
       title: "home.hireProfessional-contents.hero.title",
       subtitle: "home.hireProfessional-contents.hero.subtitle",
       backgroundImage: "./house-plan.jpg",
       icon: <Users className="w-8 h-8 text-white" />,
     },
    services: [
             {
         id: "certified-contractors",
         title: "home.hireProfessional-contents.services.certifiedContractors",
         image: "/user1.jpeg",
         link: "#",
       },
       {
         id: "design-specialists",
         title: "home.hireProfessional-contents.services.designSpecialists",
         image: "/user2.jpeg",
         link: "#",
       },
       {
         id: "project-managers",
         title: "home.hireProfessional-contents.services.projectManagers",
         image: "/user3.jpeg",
         link: "#",
       },
    ],
  },
}

export default function ServicesShowCaseSection() {
  const [activeTab, setActiveTab] = useState("home-maintenance")
  const currentContent = tabContent[activeTab]
  const { t } = useTranslation()

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
             {t(tab.label)}
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
                         <h1 className="text-white text-2xl md:text-3xl font-bold mb-4 max-w-md">{t(currentContent.hero.title)}</h1>
             <Button
               variant="link"
               className="text-white hover:text-gray-200 p-0 h-auto font-medium text-left justify-start"
             >
               {t(currentContent.hero.subtitle)}
             </Button>
          </div>
        </div>
      </div>

             {/* Dynamic Service Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {currentContent.services.map((service) => (
           <div key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl cursor-pointer">
                          <div className="relative">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  width={256}
                  height={224}
                  className="w-full h-56 object-cover rounded-xl"
                />
              </div>
             <div className="p-4">
               <h3 className="text-lg font-semibold text-gray-900 mb-3">{t(service.title)}</h3>
               <Button
                 variant="link"
                 className="text-amber-600 hover:text-amber-700 p-0 h-auto font-medium flex items-center gap-2"
               >
                 <MapPin className="w-4 h-4" />
                 {t("home.seeProsNearYou")}
               </Button>
             </div>
           </div>
         ))}
       </div>

       {/* View More Navigation */}
       <div className="mt-8 text-center">
         <Button
           variant="outline"
           className="px-8 py-3 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 transition-colors"
         >
                       {t("home.viewMore")} {activeTab === "home-maintenance" && t("home.maintenanceLabel")}
            {activeTab === "projects" && t("home.projects")}
            {activeTab === "bids-bulk" && t("home.bidsBulk")}
            {activeTab === "hire-professional" && t("home.hireProfessional")}
         </Button>
       </div>

      {/* Tab-specific additional content */}
             {activeTab === "projects" && (
         <div className="mt-8 p-6 bg-amber-50 rounded-lg">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("home.project-contents.features.title")}</h3>
           <p className="text-gray-600">
             {t("home.project-contents.features.description")}
           </p>
         </div>
       )}

       {activeTab === "bids-bulk" && (
         <div className="mt-8 p-6 bg-green-50 rounded-lg">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("home.bidsBulk-contents.process.title")}</h3>
           <p className="text-gray-600">
             {t("home.bidsBulk-contents.process.description")}
           </p>
         </div>
       )}

       {activeTab === "hire-professional" && (
         <div className="mt-8 p-6 bg-purple-50 rounded-lg">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("home.hireProfessional-contents.network.title")}</h3>
           <p className="text-gray-600">
             {t("home.hireProfessional-contents.network.description")}
           </p>
         </div>
       )}
    </div>
  )
}
