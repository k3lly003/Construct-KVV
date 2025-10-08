"use client";

import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { architectService } from "@/app/services/architectService";
import { StatCard } from "@/app/dashboard/(components)/overview/sections/stat-card";
import Notifications from "@/app/dashboard/(components)/overview/sections/notifications";
import Comments from "@/app/dashboard/(components)/overview/sections/comments";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Calendar,
  Clock,
  Users,
  Target,
  TrendingUp,
  Award,
  Star,
  MessageCircle,
  Upload,
  Eye,
} from "lucide-react";
import Image from "next/image";

const COLORS = [
  "#F59E0B",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
  "#451A03",
];

// Dummy data for the architect dashboard
const architectData = {
  profile: {
    name: "Sarah Johnson",
    avatar: "/user3.jpeg",
    role: "Senior Architect",
    company: "Johnson Architecture Studio",
  },
  stats: {
    totalDesigns: 28,
    requests: 0,
    completed: 0,
  },
  requestsData: [
    { status: "Pending", count: 2 },
    { status: "In Progress", count: 1 },
    { status: "Completed", count: 1 },
  ],
  portfolio: [
    {
      id: 1,
      title: "Modern Villa",
      status: "completed",
      thumbnail: "/house-plan.jpg",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Eco House",
      status: "in-progress",
      thumbnail: "/create-house.jpg",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Office Space",
      status: "completed",
      thumbnail: "/building.jpg",
      rating: 4.7,
    },
    {
      id: 4,
      title: "Residential Complex",
      status: "pending",
      thumbnail: "/planB.jpg",
      rating: 4.6,
    },
    {
      id: 5,
      title: "Shopping Mall",
      status: "completed",
      thumbnail: "/store-img.jpg",
      rating: 4.8,
    },
    {
      id: 6,
      title: "Community Center",
      status: "in-progress",
      thumbnail: "/architect.jpg",
      rating: 4.5,
    },
  ],
  clientFeedback: [
    {
      id: 1,
      client: "Client A",
      message: "Loved the design! Perfect balance of modern and functional.",
      rating: 5,
    },
    {
      id: 2,
      client: "Client B",
      message:
        "Please adjust window size on the east side. Otherwise excellent work.",
      rating: 4,
    },
    {
      id: 3,
      client: "Client C",
      message:
        "Excellent communication throughout the project. Highly recommended!",
      rating: 5,
    },
    {
      id: 4,
      client: "Client D",
      message: "The 3D renderings were incredibly detailed and helpful.",
      rating: 5,
    },
  ],
  performanceData: [
    { month: "May", requests: 8, designs: 12 },
    { month: "Jun", requests: 10, designs: 15 },
    { month: "Jul", requests: 12, designs: 18 },
    { month: "Aug", requests: 15, designs: 20 },
    { month: "Sep", requests: 18, designs: 22 },
    { month: "Oct", requests: 20, designs: 25 },
  ],
  topRatedDesigns: [
    {
      id: 1,
      title: "Luxury Penthouse",
      rating: 4.9,
      description: "Modern penthouse with panoramic city views",
      thumbnail: "/comp-1.webp",
    },
    {
      id: 2,
      title: "Sustainable Home",
      rating: 4.8,
      description: "Eco-friendly design with solar integration",
      thumbnail: "/comp-2.jpg",
    },
    {
      id: 3,
      title: "Corporate Headquarters",
      rating: 4.7,
      description: "Sleek office space with open concept",
      thumbnail: "/comp3.webp",
    },
  ],
  upcomingDeadlines: [
    { id: 1, project: "Villa Design", dueDate: "2024-10-10", priority: "high" },
    {
      id: 2,
      project: "Office Design",
      dueDate: "2024-10-15",
      priority: "medium",
    },
    {
      id: 3,
      project: "Renovation Plan",
      dueDate: "2024-10-20",
      priority: "low",
    },
  ],
};

export default function ArchitectOverview() {
  const [userCredentials, setUserCredentials] = useState<{
    firstName?: string;
    lastName?: string;
    role?: string;
    profilePic?: string;
    company?: string;
    totalDesigns?: number;
    requests?: number;
    completed?: number;
    requestsData?: { status: string; count: number }[];
    portfolio?: {
      id: number;
      title: string;
      status: string;
      thumbnail: string;
      rating: number;
    }[];
    clientFeedback?: {
      id: number;
      client: string;
      message: string;
      rating: number;
    }[];
    performanceData?: { month: string; requests: number; designs: number }[];
    topRatedDesigns?: {
      id: number;
      title: string;
      rating: number;
      description: string;
      thumbnail: string;
    }[];
    upcomingDeadlines?: {
      id: number;
      project: string;
      dueDate: string;
      priority: string;
    }[];
    name?: string;
  } | null>(null);

  const [designsData, setDesignsData] = useState<{
    designs: any[];
    count: number;
    loading: boolean;
    error: string | null;
  }>({
    designs: [],
    count: 0,
    loading: false,
    error: null,
  });

  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    type: "images" | "documents";
    data: string[];
    title: string;
    currentIndex: number;
  }>({
    isOpen: false,
    type: "images",
    data: [],
    title: "",
    currentIndex: 0,
  });

  // Function to fetch designs data
  const fetchDesignsData = async () => {
    try {
      setDesignsData((prev) => ({ ...prev, loading: true, error: null }));
      const response = await architectService.getMyDesigns(false);
      setDesignsData({
        designs: response.data,
        count: response.count,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching designs:", error);
      setDesignsData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load designs data",
      }));
    }
  };

  useEffect(() => {
    const user = getUserDataFromLocalStorage();
    setUserCredentials(user);
    console.log(user);

    // Fetch designs data when component mounts
    fetchDesignsData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-amber-100 text-amber-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Helper function to transform API design data to portfolio format
  const transformDesignToPortfolio = (design: any) => ({
    id: design.id,
    title: design.title,
    status: design.isActive ? "completed" : "pending",
    thumbnail: design.images?.[0],
    rating: Math.round((design.rating || 0) * 10) / 10, // Round to 1 decimal place
    images: design.images || [],
    documents: design.documents || [],
  });

  // Get portfolio data (prioritize API data, fallback to userCredentials, then dummy data)
  const getPortfolioData = () => {
    if (designsData.designs.length > 0) {
      return designsData.designs.map(transformDesignToPortfolio);
    }
    if (userCredentials?.portfolio) {
      return userCredentials.portfolio;
    }
    return architectData.portfolio;
  };

  // Get top-rated designs data (prioritize API data, fallback to userCredentials, then dummy data)
  const getTopRatedDesignsData = () => {
    if (designsData.designs.length > 0) {
      return designsData.designs
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)
        .map((design) => ({
          id: design.id,
          title: design.title,
          rating: Math.round((design.rating || 0) * 10) / 10, // Round to 1 decimal place
          description:
            design.description ||
            design.buildingDescription ||
            "No description available",
          thumbnail: design.images?.[0],
          images: design.images || [],
          documents: design.documents || [],
        }));
    }
    if (userCredentials?.topRatedDesigns) {
      return userCredentials.topRatedDesigns;
    }
    return architectData.topRatedDesigns;
  };

  // Helper functions for preview modal
  const openImagesPreview = (
    images: string[],
    title: string,
    startIndex: number = 0
  ) => {
    if (images.length > 0) {
      setPreviewModal({
        isOpen: true,
        type: "images",
        data: images,
        title: title,
        currentIndex: startIndex,
      });
    }
  };

  const openDocumentsPreview = (documents: string[], title: string) => {
    if (documents.length > 0) {
      setPreviewModal({
        isOpen: true,
        type: "documents",
        data: documents,
        title: title,
        currentIndex: 0,
      });
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      type: "images",
      data: [],
      title: "",
      currentIndex: 0,
    });
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (previewModal.type !== "images") return;

    const newIndex =
      direction === "next"
        ? (previewModal.currentIndex + 1) % previewModal.data.length
        : (previewModal.currentIndex - 1 + previewModal.data.length) %
          previewModal.data.length;

    setPreviewModal((prev) => ({
      ...prev,
      currentIndex: newIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 lg:p-8 space-y-8">
        {/* 1. Header / Welcome Section */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl shadow-lg p-6 lg:p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative">
              <Image
                src={
                  userCredentials?.profilePic || architectData.profile.avatar
                }
                alt={
                  userCredentials?.firstName
                    ? `${userCredentials.firstName} ${userCredentials.lastName}`
                    : architectData.profile.name
                }
                width={96}
                height={96}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Welcome back, {userCredentials?.firstName || ""}{" "}
                {userCredentials?.lastName || ""}!
              </h1>
              <p className="text-amber-100 text-lg mb-1">
                {userCredentials?.role || architectData.profile.role}
              </p>
              <p className="text-amber-200 text-sm mb-4">
                {userCredentials?.company || architectData.profile.company}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {designsData.loading
                      ? "..."
                      : designsData.count ||
                        userCredentials?.totalDesigns ||
                        architectData.stats.totalDesigns}
                  </div>
                  <div className="text-amber-100 text-sm">Designs Uploaded</div>
                </div>
                <RequestsReceivedQuickStat />
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userCredentials?.completed ||
                      architectData.stats.completed}
                  </div>
                  <div className="text-amber-100 text-sm">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 2. Design Requests Overview (Pie Chart) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Design Requests Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={
                    userCredentials?.requestsData || architectData.requestsData
                  }
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#F59E0B"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {(
                    userCredentials?.requestsData || architectData.requestsData
                  ).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 5. Performance (Line Chart) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Monthly Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={
                  userCredentials?.performanceData ||
                  architectData.performanceData
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#D1D5DB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#D1D5DB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  name="Requests Handled"
                />
                <Line
                  type="monotone"
                  dataKey="designs"
                  stroke="#D97706"
                  strokeWidth={3}
                  dot={{ fill: "#D97706", strokeWidth: 2, r: 4 }}
                  name="Designs Uploaded"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio and Content Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 3. Uploaded Designs Portfolio */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Design Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designsData.loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500">Loading designs...</div>
                </div>
              ) : designsData.error ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-red-500">{designsData.error}</div>
                  <button
                    onClick={fetchDesignsData}
                    className="mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                getPortfolioData().map((design) => (
                  <div key={design.id} className="group">
                    <div
                      className="relative overflow-hidden rounded-lg h-48 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${design.thumbnail})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            (design as any).images &&
                            openImagesPreview(
                              (design as any).images,
                              design.title,
                              0
                            )
                          }
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                          title="View all images"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(design as any).documents &&
                          (design as any).documents.length > 0 && (
                            <button
                              onClick={() =>
                                openDocumentsPreview(
                                  (design as any).documents,
                                  design.title
                                )
                              }
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                              title="View documents"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                      {/* Image count indicator */}
                      {(design as any).images &&
                        (design as any).images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                            +{(design as any).images.length - 1}
                          </div>
                        )}
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {design.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            design.status
                          )}`}
                        >
                          {design.status.replace("-", " ").toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          {renderStars(design.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            {design.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. Client Interactions & 7. Upcoming Deadlines */}
          <div className="space-y-8">
            {/* Client Interactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                Recent Feedback
              </h2>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {(
                  userCredentials?.clientFeedback ||
                  architectData.clientFeedback
                ).map((feedback) => (
                  <div
                    key={feedback.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {feedback.client}
                      </span>
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feedback.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                Upcoming Deadlines
              </h2>
              <div className="space-y-4">
                {(
                  userCredentials?.upcomingDeadlines ||
                  architectData.upcomingDeadlines
                ).map((deadline) => (
                  <div
                    key={deadline.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          deadline.priority
                        )}`}
                      >
                        {deadline.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {formatDate(deadline.dueDate)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {deadline.project}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Top-Rated Designs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
            Top-Rated Designs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designsData.loading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500">
                  Loading top-rated designs...
                </div>
              </div>
            ) : designsData.error ? (
              <div className="col-span-full text-center py-8">
                <div className="text-red-500">
                  Unable to load top-rated designs
                </div>
              </div>
            ) : (
              getTopRatedDesignsData().map((design) => (
                <div
                  key={design.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="relative group w-full sm:w-20 h-48 sm:h-20 flex-shrink-0">
                    <Image
                      src={design.thumbnail}
                      alt={design.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          (design as any).images &&
                          openImagesPreview(
                            (design as any).images,
                            design.title
                          )
                        }
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                        title="View all images"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      {(design as any).documents &&
                        (design as any).documents.length > 0 && (
                          <button
                            onClick={() =>
                              openDocumentsPreview(
                                (design as any).documents,
                                design.title
                              )
                            }
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                            title="View documents"
                          >
                            <Upload className="w-3 h-3" />
                          </button>
                        )}
                    </div>
                    {/* Image count indicator */}
                    {(design as any).images &&
                      (design as any).images.length > 1 && (
                        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-full">
                          +{(design as any).images.length - 1}
                        </div>
                      )}
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:text-sm">
                      {design.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-2 line-clamp-2">
                      {design.description}
                    </p>
                    <div className="flex items-center gap-1 justify-start">
                      {renderStars(design.rating)}
                      <span className="text-base sm:text-sm text-gray-600 dark:text-gray-400 ml-2 font-medium">
                        {design.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {previewModal.title} -{" "}
                {previewModal.type === "images" ? "Images" : "Documents"}
              </h3>
              <button
                onClick={closePreviewModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {previewModal.type === "images" ? (
                <div className="space-y-4">
                  {/* Main image display with navigation */}
                  <div className="relative">
                    <Image
                      src={previewModal.data[previewModal.currentIndex]}
                      alt={`Image ${previewModal.currentIndex + 1}`}
                      width={800}
                      height={600}
                      className="w-full h-96 object-contain rounded-lg bg-gray-100 dark:bg-gray-700"
                    />

                    {/* Navigation arrows */}
                    {previewModal.data.length > 1 && (
                      <>
                        <button
                          onClick={() => navigateImage("prev")}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigateImage("next")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Image counter */}
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {previewModal.currentIndex + 1} of{" "}
                    {previewModal.data.length}
                  </div>

                  {/* Thumbnail navigation */}
                  {previewModal.data.length > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                      {previewModal.data.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setPreviewModal((prev) => ({
                              ...prev,
                              currentIndex: index,
                            }))
                          }
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === previewModal.currentIndex
                              ? "border-amber-500 ring-2 ring-amber-200"
                              : "border-gray-200 dark:border-gray-600 hover:border-amber-300"
                          }`}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Thumbnail ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Open full size button */}
                  <div className="text-center">
                    <button
                      onClick={() =>
                        window.open(
                          previewModal.data[previewModal.currentIndex],
                          "_blank"
                        )
                      }
                      className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                    >
                      View Full Size
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {previewModal.data.map((docUrl, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-red-600 dark:text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Document {index + 1}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF Document
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(docUrl, "_blank")}
                        className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestsReceivedQuickStat() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchRequestsCount() {
      try {
        setLoading(true);
        setError(null);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token) throw new Error("No auth token");
        const res = await architectService.getMyDesignRequestsPaged({
          page: 1,
          limit: 10,
          sort: "createdAt",
          order: "desc",
        });
        if (mounted) setCount(res.pagination?.total ?? (res.data?.length || 0));
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchRequestsCount();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="text-center">
      <div className="text-2xl font-bold">{loading ? "..." : count ?? 0}</div>
      <div className="text-amber-100 text-sm">Requests Received</div>
      {error && <div className="text-[10px] text-red-100 mt-1">{error}</div>}
    </div>
  );
}
