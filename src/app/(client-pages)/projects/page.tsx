"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ProjectDetailsModal } from "@/app/(components)/projects/ProjectDetails";
import { PlaceBidModal } from "@/app/(components)/projects/BiddingModal";
import { mockProjects, Project } from "@/app/utils/fakes/projectFakes";
import Head from "next/head";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useTranslations } from "@/app/hooks/useTranslations";
import { GenericButton } from "@/components/ui/generic-button";
import { useProjects } from "@/app/hooks/useProjects";
import SpecialistLocator from "@/components/ui/SpecialistLocator";
import Link from "next/link";

export default function Home() {
  const [projects] = useState<Project[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] =
    useState<Project[]>(mockProjects);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [budgetRange, setBudgetRange] = useState([0, 5000000]);
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy] = useState("newest");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidProject, setBidProject] = useState<Project | null>(null);
  const { t } = useTranslations();
  const { isLoading, error } = useProjects();

  // Filter and search logic
  React.useEffect(() => {
    const filtered = projects.filter((project) => {
      // Search term filter
      const searchMatch =
        searchTerm === "" ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const categoryMatch =
        categoryFilter === "all" ||
        project.category.toLowerCase().includes(categoryFilter.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        project.status.toLowerCase() === statusFilter.toLowerCase();

      // Budget filter
      const budgetMatch =
        project.budgetMin <= budgetRange[1] &&
        project.budgetMax >= budgetRange[0];

      // Location filter
      const locationMatch =
        locationFilter === "" ||
        project.location.toLowerCase().includes(locationFilter.toLowerCase());

      return (
        searchMatch &&
        categoryMatch &&
        statusMatch &&
        budgetMatch &&
        locationMatch
      );
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "budget-high":
          return b.budgetMax - a.budgetMax;
        case "budget-low":
          return a.budgetMin - b.budgetMin;
        case "newest":
        default:
          return (
            new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime()
          );
      }
    });

    setFilteredProjects(filtered);
  }, [
    projects,
    searchTerm,
    categoryFilter,
    statusFilter,
    budgetRange,
    locationFilter,
    sortBy,
  ]);

  const formatBudgetRange = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
      }
      return formatCurrency(amount);
    };
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const handlePlaceBid = (project: Project) => {
    setBidProject(project);
    setShowBidModal(true);
    setSelectedProject(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "Rwf",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <>
        <DefaultPageBanner
          title={t("projects.title")}
          backgroundImage="/store-img.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <span className="text-amber-800">
                {t("common.loading")} {t("projects.title").toLowerCase()}...
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DefaultPageBanner
          title={t("projects.title")}
          backgroundImage="/store-img.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              {t("common.error")} {t("projects.title")}
            </h3>
            <p className="text-amber-800">{t("projects.errorTryAgain")}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Head>
        <title>Projects | Construct KVV</title>
        <meta
          name="description"
          content="Explore construction projects, find inspiration, and connect with professionals at KVV Construction."
        />
        <meta property="og:title" content="Projects | Construct KVV" />
        <meta
          property="og:description"
          content="Explore construction projects, find inspiration, and connect with professionals at KVV Construction."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.constructkvv.com/projects"
        />
        <meta property="og:image" content="/kvv-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects | Construct KVV" />
        <meta
          name="twitter:description"
          content="Explore construction projects, find inspiration, and connect with professionals at KVV Construction."
        />
        <meta name="twitter:image" content="/kvv-logo.png" />
        <link rel="canonical" href="https://www.constructkvv.com/projects" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Projects",
              url: "https://www.constructkvv.com/projects",
              description:
                "Explore construction projects, find inspiration, and connect with professionals at KVV Construction.",
            }),
          }}
        />
      </Head>
      <DefaultPageBanner
        title={t("projects.marketplaceTitle", "House Construction Marketplace")}
        backgroundImage="/store-img.jpg"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            {t("projects.availableTitle")}
          </h2>
          <p className="text-amber-800 mb-4">
            {t("projects.availableDescription")}
          </p>

          {/* Get Your Specialist Section */}
          <div className="mt-8 mb-8 p-6 bg-white border border-amber-200 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              {t("projects.getProfessionals", "Get Your professionals")}
            </h3>
            <p className="text-amber-800 mb-4">
              {t(
                "projects.findProfessionals",
                "Find certified professionals near your location."
              )}
            </p>
            <SpecialistLocator />
          </div>
          {/* Call to Action */}
          <div className="bg-amber-500 p-6 rounded-lg border border-amber-600 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("projects.readyToCreate", "Ready to create project")}
                </h3>
                <p className="text-white/90 text-sm mb-2">
                  {t(
                    "projects.readyToCreateDesc",
                    "Start your next house construction journey by creating a new project. Share your requirements and connect with top professionals."
                  )}
                </p>
              </div>
              <div className="flex justify-start sm:justify-end w-full sm:w-auto">
                <Link href="/build-house" className="w-full sm:w-auto">
                  <GenericButton className="w-full sm:w-auto bg-white hover:bg-gray-100 text-amber-600 shadow-md font-semibold flex items-center justify-center gap-2 px-4 py-3 text-base">
                    <span className="text-xl flex items-center justify-center">
                      🏠
                    </span>
                    <span className="whitespace-nowrap">
                      {t("projects.createProject")}
                    </span>
                  </GenericButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Sidebar Filters */}
        <div className="w-80 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filter Projects</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search within filters..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="commercial construction">
                      Commercial Construction
                    </SelectItem>
                    <SelectItem value="residential construction">
                      Residential Construction
                    </SelectItem>
                    <SelectItem value="industrial construction">
                      Industrial Construction
                    </SelectItem>
                    <SelectItem value="healthcare construction">
                      Healthcare Construction
                    </SelectItem>
                    <SelectItem value="educational construction">
                      Educational Construction
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm font-medium">Location</Label>
                </div>
                <Input
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm font-medium">Budget Range</Label>
                </div>
                <Slider
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  max={5000000}
                  min={0}
                  step={100000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatCurrency(budgetRange[0])}</span>
                  <span>{formatCurrency(budgetRange[1])}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="bidding">Bidding</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          project.type === "Commercial"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.type}
                      </Badge>
                      <Badge
                        variant={
                          project.status === "Open" ? "default" : "outline"
                        }
                        className={
                          project.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {project.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      C
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{project.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-green-600">
                      {formatBudgetRange(project.budgetMin, project.budgetMax)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-green-600">
                      {project.timeLeft} days
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{project.bidCount} Bids</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(project)}
                      className="flex items-center space-x-2"
                    >
                      <span>View Details</span>
                    </Button>
                    <Button
                      onClick={() => handlePlaceBid(project)}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                    >
                      <span>Place Bid</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onPlaceBid={handlePlaceBid}
        />
      )}

      {bidProject && (
        <PlaceBidModal
          project={bidProject}
          isOpen={showBidModal}
          onClose={() => {
            setShowBidModal(false);
            setBidProject(null);
          }}
          onSubmit={(bidData) => {
            console.log("Bid submitted:", bidData);
            setShowBidModal(false);
            setBidProject(null);
          }}
        />
      )}
    </div>
  );
}
