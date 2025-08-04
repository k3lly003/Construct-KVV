import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

type Category = 
  | "residential" 
  | "commercial" 
  | "industrial" 
  | "infrastructure" 
  | "renovation";

type Status = 
  | "open" 
  | "bidding" 
  | "awarded" 
  | "completed" 
  | "cancelled";

interface Project {
  category: Category;
  status: Status;
  title: string;
  description: string;
  contractor_id?: string;
  location: string;
  deadline: string | Date;
  budget_min: number;
  budget_max: number;
}

interface ProjectCardProps {
  project: Project;
  onBidClick: (project: Project) => void;
  onViewDetails: (project: Project) => void;
  bidCount?: number;
}

const categoryColors: Record<Category, string> = {
  residential: "bg-green-100 text-green-800 border-green-200",
  commercial: "bg-blue-100 text-blue-800 border-blue-200",
  industrial: "bg-purple-100 text-purple-800 border-purple-200",
  infrastructure: "bg-orange-100 text-orange-800 border-orange-200",
  renovation: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const statusColors: Record<Status, string> = {
  open: "bg-emerald-100 text-emerald-800 border-emerald-200",
  bidding: "bg-blue-100 text-blue-800 border-blue-200",
  awarded: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function ProjectCard({
  project,
  onBidClick,
  onViewDetails,
  bidCount = 0,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatBudget = (min: number, max: number) => {
    const formatValue = (value: number): string => {
      if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
      return `$${value.toLocaleString()}`;
    };
    return `${formatValue(min)} - ${formatValue(max)}`;
  };

  const daysUntilDeadline = (): number => {
    const deadline = new Date(project.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const timeLeft = daysUntilDeadline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-slate-200/60 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${categoryColors[project.category]} border font-medium`}>
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                </Badge>
                <Badge className={`${statusColors[project.status]} border font-medium`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>
            <Avatar className="w-12 h-12 border-2 border-white shadow-lg z-10">
              <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 font-semibold">
                {project.contractor_id?.charAt(0).toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 font-medium truncate">{project.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 font-medium">
                {format(new Date(project.deadline), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Budget and Timeline */}
          <div className="bg-slate-50/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">Budget Range</span>
              </div>
              <span className="font-bold text-green-700">
                {formatBudget(project.budget_min, project.budget_max)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Time Left</span>
              </div>
              <span
                className={`font-bold ${
                  timeLeft > 7 ? "text-green-600" : timeLeft > 3 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {timeLeft > 0 ? `${timeLeft} days` : "Expired"}
              </span>
            </div>
          </div>

          {/* Bid Activity */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">
                {bidCount} {bidCount === 1 ? "Bid" : "Bids"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Active</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(project)}
              className="flex-1 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => onBidClick(project)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Place Bid
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
