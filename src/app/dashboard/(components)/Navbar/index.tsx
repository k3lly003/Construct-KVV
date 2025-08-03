"use client";
import React, { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { useGlobalStore, useUserStore, useNotificationStore } from "../../../../store";
import CustomSheet from "../shad_/CustomSheet";
import ModeToggle from "../../../../components/mode-toggle";
import { getInitials } from "../../../../lib/utils";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import FlagToggle from "@/app/(components)/Navbar/ToggleFlag";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import Link from "next/link";
import { NotificationModal } from "@/components/ui/notification-modal";
import { useSocket } from "@/app/hooks/useSocket";
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  // INITIATE STATE HERE :arrow_down:
  const { isSidebarCollapsed, toggleSidebar } = useGlobalStore();
  // MANIPULATE STATE HERE :arrow_down:
  // DISPLAY THE CUSTOMSHEET
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };
  // Get user data from Zustand store
  const {
    role: userRole,
    firstName,
    lastName,
    name: userName,
    email: userEmail,
    isHydrated,
  } = useUserStore();
  // Notification modal state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = useNotificationStore();
  // Real-time notifications
  const { socket, isConnected } = useSocket();
  // Fetch notifications when modal opens
  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen, fetchNotifications]);
  // Listen for new notifications from socket
  useEffect(() => {
    if (!socket) return;
    const handler = (notification: any) => {
      // If you have addNotification in your store, use it:
      // addNotification(notification);
      // For now, just refetch notifications for simplicity:
      fetchNotifications();
    };
    socket.on("newNotification", handler);
    return () => {
      socket.off("newNotification", handler);
    };
  }, [socket, fetchNotifications]);
  const { t } = useTranslation();
  if (!isHydrated) {
    return (
      <div className="flex justify-between items-center w-full mb-7">
        {/* A minimal Navbar or loading state that is consistent server-side */}
        <div className="flex justify-between items-center gap-5">
          <button
            className="px-3 py-3 rounded-full text-muted-foreground border hover:cursor-pointer"
            onClick={toggleSidebar}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
        {/* Placeholder for right side to match server render */}
        <div className="flex justify-between items-center gap-5">
          <ModeToggle />
          {/* Other elements that don't depend on userRole could go here */}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 rounded-full text-muted-foreground border hover:cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
      {/* RIGHT SIDE */}
      <div className='flex justify-end gap-5 w-full'>
        <div className='flex justify-between items-center text-right gap-5'>
          <div>
            <ModeToggle />
          </div>
          <div className='relative md:flex border p-2 rounded-lg focus:outline-none'>
            <Bell
              className="cursor-pointer text-gray-500"
              size={24}
              onClick={() => setIsNotificationOpen(true)}
            />
            {getUnreadCount() > 0 && (
              <span className='absolute top-0 left-7 inline-flex items-center justify-center p-1 text-xs font-semibold leading-none text-red-100 bg-amber-500 rounded-full'>
                {getUnreadCount()}
              </span>
            )}
            <NotificationModal
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <FlagToggle />
          <hr className="hidden md:flex w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
          {userName && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">{t(dashboardFakes.navbar.profile)}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">{t(dashboardFakes.navbar.backHome)}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
