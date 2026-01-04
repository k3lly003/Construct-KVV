"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "./loading-spinner";

interface NotificationIconProps {
  count: number;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
}

export function NotificationIcon({
  count,
  onClick,
  className = "",
  isLoading = false,
}: NotificationIconProps) {
  const { isAuthenticated } = useAuth();
  const displayCount = count > 10 ? "10+" : count.toString();
  const hasNotifications = count > 0;

  // If not authenticated, show a disabled state with login prompt
  if (!isAuthenticated) {
    return (
      <button
        disabled
        className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 opacity-50 cursor-not-allowed ${className}`}
        title="Login to view notifications"
      >
        <Bell className="h-5 w-5 text-gray-400" />
      </button>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <button
        disabled
        className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 ${className}`}
        title="Loading notifications..."
      >
        <LoadingSpinner size="sm" className="text-amber-600" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 hover:bg-amber-50 ${className}`}
      title={`${count} notification${count !== 1 ? "s" : ""}`}
    >
      <Bell className="h-5 w-5 text-amber-600" />

      {/* Always show badge for authenticated users */}
      <Badge
        className={`absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-small font-medium ${
          hasNotifications
            ? "bg-amber-500 text-white border-2 border-white"
            : "bg-gray-300 text-gray-600 border-2 border-white"
        }`}
      >
        {hasNotifications ? displayCount : "0"}
      </Badge>
    </button>
  );
}
