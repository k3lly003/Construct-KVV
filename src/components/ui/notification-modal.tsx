"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GenericButton } from "@/components/ui/generic-button";
import { Bell, Clock } from "lucide-react";
import { formatNotificationTime } from "@/utils/formatTime";

export interface Notification {
  id: string;
  userId: string;
  sellerId: string | null;
  admin: boolean;
  title: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  priority: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  isLoading,
  error,
}: NotificationModalProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "✅";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "border-green-200 bg-green-50";
      case "WARNING":
        return "border-yellow-200 bg-yellow-50";
      case "ERROR":
        return "border-red-200 bg-red-50";
      default:
        return "border-amber-200 bg-amber-50";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md w-full bg-white border-amber-200"
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <DialogHeader className="border-b border-amber-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-amber-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-amber-700">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-red-700 font-medium">
                Error loading notifications
              </p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <p className="text-amber-700 font-medium">No Notifications</p>
              <p className="text-amber-600 text-sm mt-1">
                You have no notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex pb-2 w-full">
                <GenericButton
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-amber-600 border-amber-300 hover:bg-amber-50 text-xs w-full sm:w-auto"
                  disabled={notifications.length === 0}
                >
                  Mark read all
                </GenericButton>
              </div>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    notification.isRead
                      ? "border-gray-200 bg-white"
                      : `${getNotificationColor(
                          notification.type
                        )} border-l-4 border-l-amber-500`
                  }`}
                  onClick={() =>
                    !notification.isRead && onMarkAsRead(notification.id)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium text-sm ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-amber-900"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>

                      <p
                        className={`text-sm mb-2 ${
                          notification.isRead
                            ? "text-gray-600"
                            : "text-amber-800"
                        }`}
                      >
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-amber-200 pt-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-700">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </span>
            <GenericButton
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              View all
            </GenericButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
