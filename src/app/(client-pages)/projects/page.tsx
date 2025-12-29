"use client";

import React, { useState } from "react";
import {
  Clock,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
// Removed unused imports for traditional projects
import Head from "next/head";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useTranslations } from "@/app/hooks/useTranslations";
import { GenericButton } from "@/components/ui/generic-button";
// Removed useProjects hook since we're not using traditional projects
import SpecialistLocator from "@/components/ui/SpecialistLocator";
import Link from "next/link";
import CreateFloorplanProjectForm from "@/app/dashboard/(components)/projects/CreateFloorplanProjectForm";
import { useFloorplanProject } from "@/app/hooks/useFloorplanProject";
import { ProjectListItem } from "@/app/services/floorplanProjectService";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  // Removed unused filter state for traditional projects
  
  // New state for floorplan projects
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [floorplanProjects, setFloorplanProjects] = useState<ProjectListItem[]>([]);
  
  const { t } = useTranslations();
  const { getAllProjects: getFloorplanProjects } = useFloorplanProject();
  const { role } = useUserStore();

  // Load floorplan projects on component mount
  React.useEffect(() => {
    const loadFloorplanProjects = async () => {
      try {
        const projects = await getFloorplanProjects();
        setFloorplanProjects(projects);
      } catch (err) {
        console.error('Failed to load floorplan projects:', err);
      }
    };
    loadFloorplanProjects();
  }, [getFloorplanProjects]);

  // Removed filter logic for traditional projects

  // Removed unused handlers for traditional projects

  const handleCreateProjectSuccess = async (projectId: string) => {
    setShowCreateForm(false);
    // Reload floorplan projects
    try {
      const projects = await getFloorplanProjects();
      setFloorplanProjects(projects);
    } catch (err) {
      console.error('Failed to reload floorplan projects:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "Rwf",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Removed loading and error states for traditional projects

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
          <h2 className="text-title font-bold text-amber-900 mb-2">
            {t("projects.availableTitle")}
          </h2>
          <p className="text-amber-800 mb-4">
            {t("projects.availableDescription")}
          </p>

       
          {/* Call to Action */}
          <div className="bg-amber-500 p-6 rounded-lg border border-amber-600 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-mid font-semibold text-white mb-2">
                  {t("projects.readyToCreate", "Ready to create project")}
                </h3>
                <p className="text-white/90 text-small mb-2">
                  {t(
                    "projects.readyToCreateDesc",
                    "Upload your architect's floorplan and our AI will automatically analyze it, generate cost estimates, and create a complete project ready for contractor bidding."
                  )}
                </p>
              </div>
              <div className="flex justify-start sm:justify-end w-full sm:w-auto">
                <GenericButton 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-amber-600 shadow-md font-semibold flex items-center justify-center gap-2 px-4 py-3 text-base"
                >
                  <span className="text-mid flex items-center justify-center">
                    🏠
                  </span>
                  <span className="whitespace-nowrap">
                    {t("projects.createProject")}
                  </span>
                </GenericButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Floorplan Projects Section */}
          {floorplanProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="text-mid font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-mid">🏗️</span>
                Construction Projects
                <span className="text-small font-normal text-gray-500">
                  ({floorplanProjects.length} projects)
                </span>
              </h3>
              <div className="space-y-4">
                {floorplanProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-amber-500 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Badge variant="default" className="bg-amber-100 text-amber-800">
                              AI Generated
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                project.status === "OPEN"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "DRAFT"
                                  ? "bg-gray-100 text-gray-800"
                                  : project.status === "CLOSED"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <h2 className="text-mid font-semibold text-amber-900">
                            Project #{project.id.slice(-8)}
                          </h2>
                        </div>
                        <div className="text-right">
                          <span className="text-small text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                            FP
                          </span>
                        </div>
                      </div>

                      {project.summary && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {project.summary}
                        </p>
                      )}

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-small text-amber-800">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {project.totalEstimatedCost && (
                          <div className="flex items-center space-x-2 text-small text-amber-800">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium text-green-600">
                              {new Intl.NumberFormat("en-RW", {
                                style: "currency",
                                currency: project.currency || "RWF",
                                minimumFractionDigits: 0,
                              }).format(project.totalEstimatedCost)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-small text-amber-800">
                          <Clock className="h-4 w-4" />
                          <span>AI Processed</span>
                        </div>
                        <div className="flex items-center space-x-2 text-small text-amber-800">
                          <Users className="h-4 w-4" />
                          <span>Ready for Bids</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-small text-amber-800">Floorplan Based</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            className="flex items-center space-x-2 border-amber-400 text-amber-700 hover:bg-amber-50"
                            onClick={() => window.location.href = `/projects/${project.id}`}
                          >
                            <span>View Details</span>
                          </Button>
                          {role === "CONTRACTOR" ? (
                            <Button
                              className="bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-2"
                              disabled={project.status !== "OPEN"}
                            >
                              <span>Place Bid</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="flex items-center space-x-2 border-amber-400 text-amber-700 hover:bg-amber-50"
                              onClick={() => window.location.href = `/projects/${project.id}/bids`}
                            >
                              <span>View Bids</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Show message when no projects exist */}
          {floorplanProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-6xl">🏗️</span>
              </div>
              <h3 className="text-mid font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to create a construction project! Simply upload your architect's floorplan and our AI will automatically analyze it, generate cost estimates, and create a complete project ready for contractor bidding.
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Create Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Removed unused modals for traditional projects */}

      {/* Create Floorplan Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-mid font-bold text-gray-900">Create New Project</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <CreateFloorplanProjectForm
                onSuccess={handleCreateProjectSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
