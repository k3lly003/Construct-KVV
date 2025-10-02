"use client";

import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
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
    requests: 12,
    completed: 7,
  },
  requestsData: [
    { status: "Pending", count: 5 },
    { status: "In Progress", count: 3 },
    { status: "Completed", count: 4 },
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
  } | null>(null);

  useEffect(() => {
    const user = getUserDataFromLocalStorage();
    setUserCredentials(user);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 lg:p-8 space-y-8">
        {/* 1. Header / Welcome Section */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl shadow-lg p-6 lg:p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative">
              <Image
                src={architectData.profile.avatar}
                alt={architectData.profile.name}
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
                {architectData.profile.role}
              </p>
              <p className="text-amber-200 text-sm mb-4">
                {architectData.profile.company}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {architectData.stats.totalDesigns}
                  </div>
                  <div className="text-amber-100 text-sm">Designs Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {architectData.stats.requests}
                  </div>
                  <div className="text-amber-100 text-sm">
                    Requests Received
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {architectData.stats.completed}
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
                  data={architectData.requestsData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#F59E0B"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {architectData.requestsData.map((entry, index) => (
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
                data={architectData.performanceData}
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
              {architectData.portfolio.map((design) => (
                <div key={design.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={design.thumbnail}
                      alt={design.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
                    </div>
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
              ))}
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
                {architectData.clientFeedback.map((feedback) => (
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
                {architectData.upcomingDeadlines.map((deadline) => (
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
            {architectData.topRatedDesigns.map((design) => (
              <div
                key={design.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition-shadow"
              >
                <Image
                  src={design.thumbnail}
                  alt={design.title}
                  width={80}
                  height={80}
                  className="w-full sm:w-20 h-48 sm:h-20 object-cover rounded-lg flex-shrink-0"
                />
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
