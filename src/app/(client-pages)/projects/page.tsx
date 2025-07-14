"use client";

import React from "react";
import DefaultPageBanner from "@/components/ui/DefaultPageBanner";
import { useProjects } from "@/app/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { GenericButton } from "@/components/ui/generic-button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { projectService, ProjectStatus } from "@/app/services/projectServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpecialistLocator from "@/components/ui/SpecialistLocator";
import { useTranslations } from '@/app/hooks/useTranslations';

const ProjectsPage = () => {
  const { t } = useTranslations();
  const { projects, isLoading, error, deleteProject } = useProjects();
  const [updatingStatuses, setUpdatingStatuses] = React.useState<{
    [key: string]: boolean;
  }>({});

  const handleDeleteProject = async (id: string, projectName: string) => {
    try {
      await deleteProject(id);
      toast.success(`Project "${projectName}" deleted successfully`);
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleUpdateProject = async (projectId: string) => {
    console.log("🔄 Navigating to project detail page for update:", projectId);

    // Navigate to the project detail page where users can update with proper form fields
    window.location.href = `/projects/${projectId}`;
  };

  const handleStatusUpdate = async (
    projectId: string,
    newStatus: ProjectStatus
  ) => {
    setUpdatingStatuses((prev) => ({ ...prev, [projectId]: true }));

    try {
      console.log("🔄 Updating project status:", projectId, "to:", newStatus);

      await projectService.updateProjectStatus(projectId, newStatus);

      // Refresh the projects list
      window.location.reload();

      toast.success(`Project status updated to ${newStatus} successfully! 🎉`);
    } catch (error) {
      console.error("❌ Error updating project status:", error);
      toast.error("Failed to update project status. Please try again.");
    } finally {
      setUpdatingStatuses((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "OPEN":
        return "bg-green-100 text-green-800 border-green-300";
      case "CLOSED":
        return "bg-red-100 text-red-800 border-red-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case "DRAFT":
        return "📝";
      case "OPEN":
        return "🔓";
      case "CLOSED":
        return "🔒";
      case "COMPLETED":
        return "✅";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          title={t('projects.title')}
          backgroundImage="/store-img.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <span className="text-amber-800">{t('common.loading')} {t('projects.title').toLowerCase()}...</span>
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
          title={t('projects.title')}
          backgroundImage="/store-img.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              {t('common.error')} {t('projects.title')}
            </h3>
            <p className="text-amber-800">
              {t('projects.errorTryAgain')}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DefaultPageBanner
        title={t('projects.marketplaceTitle', 'House Construction Marketplace')}
        backgroundImage="/store-img.jpg"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            {t('projects.availableTitle')}
          </h2>
          <p className="text-amber-800 mb-4">
            {t('projects.availableDescription')}
          </p>

          {/* Professional Categories */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🏗️ Architects
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🔧 Plumbers
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🎨 Painters
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              ⚡ Electricians
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🧱 Contractors
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🌳 Landscapers
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🏠 Interior Designers
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-amber-500 text-amber-700 bg-white"
            >
              🔨 General Contractors
            </Badge>
          </div>

          {/* Get Your Specialist Section */}
          <div className="mt-8 mb-8 p-6 bg-white border border-amber-200 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              {t('projects.getProfessionals', 'Get Your professionals')}
            </h3>
            <p className="text-amber-800 mb-4">
              {t('projects.findProfessionals', 'Find certified professionals near your location.')}
            </p>
            <SpecialistLocator />
          </div>

          {/* Call to Action */}
          <div className="bg-amber-500 p-6 rounded-lg border border-amber-600 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('projects.readyToCreate', 'Ready to create project')}
                </h3>
                <p className="text-white/90 text-sm mb-2">
                  {t('projects.readyToCreateDesc', 'Start your next house construction journey by creating a new project. Share your requirements and connect with top professionals.')}
                </p>
              </div>
              <div className="flex justify-start sm:justify-end w-full sm:w-auto">
                <Link href="/build-house" className="w-full sm:w-auto">
                  <GenericButton className="w-full sm:w-auto bg-white hover:bg-gray-100 text-amber-600 shadow-md font-semibold flex items-center justify-center gap-2 px-4 py-3 text-base">
                    <span className="text-xl flex items-center justify-center">
                      🏠
                    </span>
                    <span className="whitespace-nowrap">
                      {t('projects.createProject')}
                    </span>
                  </GenericButton>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 text-amber-500 mx-auto mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              {t('projects.noProjects', 'No Projects Available')}
            </h3>
            <p className="text-amber-800 mb-6">
              {t('projects.noProjectsDesc', 'There are currently no house construction projects available for bidding. Check back later or create your own project to get started!')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/build-house">
                <GenericButton className="bg-amber-500 hover:bg-amber-600 text-white shadow-md">
                  🏠 {t('projects.createProject')}
                </GenericButton>
              </Link>
              <GenericButton
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
              >
                🔄 {t('common.reload', 'Refresh Page')}
              </GenericButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-500 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900 mb-1">
                        {project.choosenEstimation.description.substring(0, 50)}
                        ...
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(project.status)}`}
                      >
                        {getStatusIcon(project.status)} {project.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-amber-800">
                      <span className="font-medium mr-2">💰</span>
                      <span className="font-medium text-amber-700">
                        {formatCurrency(
                          project.choosenEstimation.estimatedCost
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-amber-800">
                        <span className="mr-2">🛏️</span>
                        <span>
                          {project.choosenEstimation.roomsCount} Bedrooms
                        </span>
                      </div>
                      <div className="flex items-center text-amber-800">
                        <span className="mr-2">🚿</span>
                        <span>
                          {project.choosenEstimation.bathroomsCount} Bathrooms
                        </span>
                      </div>
                      <div className="flex items-center text-amber-800">
                        <span className="mr-2">🍳</span>
                        <span>
                          {project.choosenEstimation.kitchensCount} Kitchens
                        </span>
                      </div>
                      <div className="flex items-center text-amber-800">
                        <span className="mr-2">👥</span>
                        <span>
                          {project.choosenEstimation.conversationRoomsCount}{" "}
                          Living Rooms
                        </span>
                      </div>
                    </div>

                    {project.choosenEstimation.extras.length > 0 && (
                      <div className="text-sm">
                        <span className="text-amber-800 font-medium">
                          Extras:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.choosenEstimation.extras
                            .slice(0, 3)
                            .map((extra, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs border-amber-500 text-amber-700 bg-white"
                              >
                                {extra.name} ({extra.detail.count})
                              </Badge>
                            ))}
                          {project.choosenEstimation.extras.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-amber-500 text-amber-700 bg-white"
                            >
                              +{project.choosenEstimation.extras.length - 3}{" "}
                              more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-amber-700">
                      <span className="mr-2">📅</span>
                      <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <GenericButton
                        variant="outline"
                        fullWidth
                        className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
                      >
                        👁️ {t('projects.viewDetails', 'View Details & Bid')}
                      </GenericButton>
                    </Link>
                    <div className="flex flex-col space-y-1">
                      <Select
                        value={project.status}
                        onValueChange={(value: ProjectStatus) =>
                          handleStatusUpdate(project.id, value)
                        }
                        disabled={updatingStatuses[project.id]}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs border-amber-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">📝 Draft</SelectItem>
                          <SelectItem value="OPEN">🔓 Open</SelectItem>
                          <SelectItem value="CLOSED">🔒 Closed</SelectItem>
                          <SelectItem value="COMPLETED">✅ Done</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingStatuses[project.id] && (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-500"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <GenericButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProject(project.id)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-300 bg-white"
                        title="Edit Project"
                      >
                        ✏️
                      </GenericButton>
                      <GenericButton
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteProject(
                            project.id,
                            project.choosenEstimation.description.substring(
                              0,
                              30
                            )
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 bg-white"
                      >
                        🗑️
                      </GenericButton>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;
