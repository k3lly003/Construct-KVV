"use client";

import React from "react";

import { StatCard } from "@/app/dashboard/(components)/overview/sections/stat-card";
import Comments from "@/app/dashboard/(components)/overview/sections/comments";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useProducts } from "@/app/hooks/useProduct";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/app/hooks/useCategories";
import { useDashboard } from "@/hooks/useDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
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
} from "lucide-react";

const COLORS = [
  "#F59E0B",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
  "#451A03",
];

// Dummy data for the contractor dashboard
const contractorData = {
  profile: {
    name: "John Miller",
    avatar: "/user1.jpeg",
    role: "Senior Construction Contractor",
    company: "Miller Construction Co.",
  },
  summary: {
    totalBids: 12,
    projectsWon: 4,
    activeProjects: 2,
  },
  budgetData: [
    { category: "Materials", budget: 50000, spent: 35000 },
    { category: "Labor", budget: 40000, spent: 28000 },
    { category: "Equipment", budget: 25000, spent: 18000 },
    { category: "Permits", budget: 5000, spent: 4500 },
    { category: "Other", budget: 10000, spent: 6000 },
  ],
  progressData: [
    { week: "Week 1", completion: 10 },
    { week: "Week 2", completion: 30 },
    { week: "Week 3", completion: 60 },
    { week: "Week 4", completion: 80 },
    { week: "Week 5", completion: 95 },
  ],
  milestones: [
    { id: 1, title: "Foundation Completed", status: "completed", icon: "✅" },
    { id: 2, title: "Walls Up", status: "completed", icon: "🧱" },
    { id: 3, title: "Roofing Started", status: "in-progress", icon: "🏗️" },
    { id: 4, title: "Electrical Work", status: "pending", icon: "⚡" },
    { id: 5, title: "Final Inspection", status: "pending", icon: "📋" },
  ],
  workers: [
    { id: 1, name: "Mike Johnson", role: "Foreman", avatar: "/user2.jpeg" },
    { id: 2, name: "Sarah Davis", role: "Electrician", avatar: "/user3.jpeg" },
    { id: 3, name: "Tom Wilson", role: "Plumber", avatar: "/user4.jpeg" },
    { id: 4, name: "Lisa Brown", role: "Carpenter", avatar: "/user5.jpeg" },
    { id: 5, name: "James Taylor", role: "Mason", avatar: "/user1.jpeg" },
    { id: 6, name: "Anna Garcia", role: "Painter", avatar: "/user2.jpeg" },
  ],
  deadlines: [
    {
      id: 1,
      task: "Complete electrical wiring",
      dueDate: "2024-10-15",
      priority: "high",
    },
    {
      id: 2,
      task: "Install plumbing fixtures",
      dueDate: "2024-10-18",
      priority: "medium",
    },
    {
      id: 3,
      task: "Finish interior painting",
      dueDate: "2024-10-22",
      priority: "low",
    },
  ],
};

export default function ConstructorOverview() {
  // Custom dashboard hook
  const {
    userInfo,
    stats,
    recentOrders,
    revenueData,
    projectsData,
    searchTerm,
    isLoading,
    hasError,
    error,
    handleSearch,
    handleRefresh,
    handleClearError,
  } = useDashboard();

  // Console log userInfo to see available data
  console.log("UserInfo data:", userInfo);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Live projectsBidOn fetched from bids endpoint
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string | undefined;
  const [bidsLoading, setBidsLoading] = React.useState<boolean>(true);
  const [projectsBidOn, setProjectsBidOn] = React.useState<number>(0);
  const [bidsError, setBidsError] = React.useState<string | null>(null);
  const [acceptedCount, setAcceptedCount] = React.useState<number>(0);
  const [rejectedCount, setRejectedCount] = React.useState<number>(0);

  React.useEffect(() => {
    let mounted = true;
    async function fetchBids() {
      setBidsLoading(true);
      setBidsError(null);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token || !API_URL) throw new Error("No auth token or API URL");
        const res = await fetch(`${API_URL}/api/v1/bids/contractor`, {
          headers: { Authorization: `Bearer ${token}`, accept: "*/*" },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch bids: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        let bidsData: any[] = [];
        if (Array.isArray(data)) bidsData = data;
        else if (data?.data && Array.isArray(data.data)) bidsData = data.data;
        else if (data?.bids && Array.isArray(data.bids)) bidsData = data.bids;
        if (mounted) {
          setProjectsBidOn(bidsData.length);
          setAcceptedCount(
            bidsData.filter((b: any) => b?.status === "ACCEPTED").length
          );
          setRejectedCount(
            bidsData.filter((b: any) => b?.status === "REJECTED").length
          );
        }
      } catch (e: any) {
        if (mounted) setBidsError(e?.message || "Failed to load bids");
      } finally {
        if (mounted) setBidsLoading(false);
      }
    }
    fetchBids();
    return () => {
      mounted = false;
    };
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 lg:p-8 space-y-8">
        {/* 1. Header / Welcome Section */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl shadow-lg p-6 lg:p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={userInfo.profilePic || ""}
                alt={userInfo.firstName || "User"}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Welcome back, {userInfo.fullName || "User"}!
              </h1>
              <p className="text-amber-100 text-lg mb-1">
                {userInfo.role || ""}
              </p>
              <p className="text-amber-200 text-sm">
                {contractorData.profile.company}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Bids & Projects Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Bids Placed
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {bidsLoading
                    ? "..."
                    : projectsBidOn || contractorData.summary.totalBids}
                </p>
                {bidsError && (
                  <p className="text-xs text-red-500 mt-1">{bidsError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Projects Won
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {bidsLoading
                    ? "..."
                    : acceptedCount || contractorData.summary.projectsWon}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rejected
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {bidsLoading ? "..." : rejectedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 3. Budget Overview (Bar Chart) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Budget Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={contractorData.budgetData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#D1D5DB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#D1D5DB" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                />
                <Bar
                  dataKey="budget"
                  fill="#FCD34D"
                  name="Budget"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="spent"
                  fill="#F59E0B"
                  name="Spent"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 4. Project Progress (Line Chart) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Project Progress Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={contractorData.progressData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#D1D5DB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#D1D5DB" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: any) => [`${value}%`, "Completion"]}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#D97706" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 5. Milestones & Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Project Milestones
            </h2>
            <div className="space-y-4">
              {contractorData.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${
                      milestone.status === "completed"
                        ? "bg-green-100"
                        : milestone.status === "in-progress"
                        ? "bg-amber-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {milestone.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        milestone.status === "completed"
                          ? "text-green-800"
                          : milestone.status === "in-progress"
                          ? "text-amber-800"
                          : "text-gray-600"
                      }`}
                    >
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {milestone.status.replace("-", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Assigned Workers */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Team Members
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {contractorData.workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {worker.name}
                    </p>
                    <p className="text-xs text-gray-500">{worker.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              Upcoming Deadlines
            </h2>
            <div className="space-y-4">
              {contractorData.deadlines.map((deadline) => (
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
                    {deadline.task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
