"use client";

import React from "react";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useProject } from "@/app/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenericButton } from "@/components/ui/generic-button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = React.use(params);
  const { project, isLoading, error } = useProject(resolvedParams.id);

  console.log("🏠 Project Page Rendered for ID:", resolvedParams.id);
  console.log("📊 Project Data:", project);
  console.log("🔄 Loading:", isLoading);
  console.log("❌ Error:", error);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <>
        <DefaultPageBanner
          title="Project Details & Bidding"
          backgroundImage="/building.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <span className="text-amber-800">Loading project details...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <DefaultPageBanner
          title="Project Details & Bidding"
          backgroundImage="/building.jpg"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Project Not Found
            </h3>
            <p className="text-amber-800 mb-6">
              The project you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link href="/projects">
              <GenericButton
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
              >
                ← Back to Projects
              </GenericButton>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DefaultPageBanner
        title="Project Details & Bidding"
        backgroundImage="/building.jpg"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/projects">
            <GenericButton
              variant="outline"
              size="sm"
              className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
            >
              ← Back to Projects
            </GenericButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Project Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-amber-900 mb-2">
                    House Project
                  </h1>
                  <Badge
                    variant={
                      project.status === "DRAFT" ? "secondary" : "default"
                    }
                    className={`text-sm ${
                      project.status === "DRAFT"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-amber-500 text-white border-amber-500"
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-700">Project ID</p>
                  <p className="text-xs text-amber-600 font-mono">
                    {project.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    Project Description
                  </h3>
                  <p className="text-amber-800 leading-relaxed">
                    {project.choosenEstimation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🛏️</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.roomsCount}
                    </div>
                    <div className="text-xs text-amber-700">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🚿</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.bathroomsCount}
                    </div>
                    <div className="text-xs text-amber-700">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🍳</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.kitchensCount}
                    </div>
                    <div className="text-xs text-amber-700">Kitchens</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-sm font-medium text-amber-900">
                      {project.choosenEstimation.conversationRoomsCount}
                    </div>
                    <div className="text-xs text-amber-700">Living Rooms</div>
                  </div>
                </div>

                {project.choosenEstimation.extras.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">
                      Additional Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.choosenEstimation.extras.map((extra, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm border-amber-500 text-amber-700 bg-white"
                        >
                          {extra.name.replace(/_/g, " ")} ({extra.detail.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bids Section */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Bids & Offers
              </h3>
              {project.bids.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-amber-800">
                    No bids have been submitted yet.
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    Suppliers will be able to submit bids once the project is
                    published.
                  </p>

                  {/* Call to Action for Professionals */}
                  <div className="mt-6 p-4 bg-amber-500 rounded-lg border border-amber-600">
                    <h4 className="font-semibold text-white mb-2">
                      Ready to Submit Your Bid?
                    </h4>
                    <p className="text-white/90 text-sm mb-3">
                      Are you a qualified professional? Submit your competitive
                      bid for this project.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🏗️ Architects
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🔧 Plumbers
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🎨 Painters
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        ⚡ Electricians
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🧱 Contractors
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white text-white bg-transparent"
                      >
                        🌳 Landscapers
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <GenericButton className="bg-white hover:bg-gray-100 text-amber-600 shadow-md font-semibold">
                        💼 Submit Your Bid
                      </GenericButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="p-4 border border-amber-200 rounded-lg bg-amber-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-amber-900">
                            Bid #{index + 1}
                          </p>
                          <p className="text-sm text-amber-800">
                            {bid.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">
                            {formatCurrency(bid.amount || 0)}
                          </p>
                          <p className="text-xs text-amber-600">
                            {formatDate(bid.createdAt || "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Call to Action even when bids exist */}
                  <div className="mt-4 p-4 bg-amber-500 rounded-lg border border-amber-600">
                    <h4 className="font-semibold text-white mb-2">
                      Want to Submit Your Bid?
                    </h4>
                    <p className="text-white/90 text-sm">
                      Join the competition and submit your professional bid for
                      this project.
                    </p>
                    <div className="mt-3">
                      <GenericButton
                        variant="outline"
                        className="text-white border-white hover:bg-white hover:text-amber-600 bg-transparent"
                      >
                        💼 Submit Your Bid
                      </GenericButton>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Information */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Cost Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amber-800">Estimated Cost:</span>
                  <span className="font-semibold text-amber-600 text-lg">
                    {formatCurrency(project.choosenEstimation.estimatedCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-800">Project Status:</span>
                  <Badge
                    variant={
                      project.status === "DRAFT" ? "secondary" : "default"
                    }
                    className={`${
                      project.status === "DRAFT"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-amber-500 text-white border-amber-500"
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Project Timeline */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Project Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-amber-700">Created</p>
                  <p className="font-medium text-amber-900">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Estimation Created</p>
                  <p className="font-medium text-amber-900">
                    {formatDate(project.choosenEstimation.createdAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Owner Information */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Project Owner
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-amber-700">Name</p>
                  <p className="font-medium text-amber-900">
                    {project.owner.firstName} {project.owner.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Email</p>
                  <p className="font-medium text-amber-900">
                    {project.owner.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Phone</p>
                  <p className="font-medium text-amber-900">
                    {project.owner.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700">Role</p>
                  <Badge
                    variant="outline"
                    className="border-amber-500 text-amber-700 bg-white"
                  >
                    {project.owner.role}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Professional Opportunities */}
            <Card className="p-6 border-amber-200 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Professional Opportunities
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-amber-700 mb-2">
                    This project needs:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🏗️ Architecture
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🔧 Plumbing
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      ⚡ Electrical
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🎨 Painting
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🧱 Construction
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🌳 Landscaping
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-700 bg-white"
                    >
                      🏠 Interior Design
                    </Badge>
                  </div>
                </div>
                <div className="pt-3 border-t border-amber-200">
                  <p className="text-sm text-amber-700 mb-2">Current Bids:</p>
                  <p className="font-semibold text-lg text-amber-600">
                    {project.bids.length}{" "}
                    {project.bids.length === 1 ? "bid" : "bids"}
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-200">
                  <GenericButton
                    variant="outline"
                    fullWidth
                    className="text-amber-600 border-amber-500 hover:bg-amber-50 bg-white"
                  >
                    💼 Submit Your Bid
                  </GenericButton>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
