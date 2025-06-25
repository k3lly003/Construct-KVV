"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationIconProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export function NotificationIcon({
  count,
  onClick,
  className = "",
}: NotificationIconProps) {
  const displayCount = count > 10 ? "10+" : count.toString();
  const hasNotifications = count > 0;

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 hover:bg-amber-50 ${className}`}
      title={`${count} notification${count !== 1 ? "s" : ""}`}
    >
      <Bell className="h-5 w-5 text-amber-600" />

      {hasNotifications && (
        <Badge
          className={`absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-xs font-medium bg-amber-500 text-white border-2 border-white ${
            count > 10 ? "text-xs" : "text-xs"
          }`}
        >
          {displayCount}
        </Badge>
      )}
    </button>
  );
}
