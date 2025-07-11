"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import Link from "next/link";
import FlagToggle from "@/app/(components)/Navbar/ToggleFlag";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Profile from "@/app/(components)/Navbar/Profile";
import { useUserStore } from "@/store/userStore";
import CustomerProfile from "@/app/(components)/Navbar/CustomerProfile";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { useCategories } from "@/app/hooks/useCategories";
import { NotificationIcon } from "@/components/ui/notification-icon";
import { NotificationModal } from "@/components/ui/notification-modal";
import { useNotificationStore } from "@/store/notificationStore";


const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // New state to track if on client
  const [localUserData, setLocalUserData] = useState<unknown>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Get user data from Zustand store
  const { role: userRole, name: userName, email: userEmail } = useUserStore();
  // Get notification data from store
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    fetchNotifications,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useNotificationStore();
  const { categories: rawCategories } = useCategories();
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

    // Fetch notifications only when client and user data are set
    useEffect(() => {
      if (isClient && localUserData) {
        fetchNotifications();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient, localUserData]);

    const handleNotificationClick = async () => {
      // Refresh notifications when opening the modal
      await fetchNotifications();
      setIsNotificationModalOpen(true);
    };
  
    const handleNotificationClose = () => {
      setIsNotificationModalOpen(false);
    };

    const handleMarkAsRead = (id: string) => {
      markAsRead(id);
    };
  
    const handleMarkAllAsRead = () => {
      markAllAsRead();
    };
  const parentCategories = categories.filter(cat => !cat.parentId);
  const subCategoriesMap = categories
    .filter(cat => typeof cat.parentId === "string" && cat.parentId)
    .reduce((acc, sub) => {
      if (!acc[sub.parentId!]) acc[sub.parentId!] = [];
      acc[sub.parentId!].push(sub);
      return acc;
    }, {} as Record<string, typeof categories>);

  const featuresSections = parentCategories.map(parent => ({
    title: parent.name,
    items: [
      {
        name: parent.name,
        href: `/category/${parent.slug || parent.id}`,
        subItems: (subCategoriesMap[parent.id] || []).map(sub => ({
          name: sub.name,
          href: `/category/${parent.slug || parent.id}/${sub.slug || sub.id}`,
        })),
      },
    ],
  }));

  useEffect(() => {
    // This code only runs on the client after hydration
    setIsClient(true);
    setLocalUserData(getUserDataFromLocalStorage());

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-menu")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMenuClick = (label: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === label ? null : label);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <div className="flex-shrink-0 flex items-center mr-5">
                <Image src="/kvv-logo.png" alt="KVV Pro" width={42} height={42} />
                <span className="ml-2 text-xl text-amber-500 font-semibold">kvv</span>
              </div>
            </Link>

            {/* Main navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <div className="relative nav-menu">
                <button
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  onClick={(e) => handleMenuClick("Features", e)}
                >
                  Features
                  {activeMenu === "Features" ? (
                    <ChevronUp className="ml-1 h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                  )}
                </button>
                <AnimatePresence>
                  {activeMenu === "Features" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="absolute left-0 z-10 mt-2 w-screen max-w-[700px] bg-white shadow-2xl"
                    >
                      <div className="grid grid-cols-3 gap-8 p-8">
                        {featuresSections.map(section => (
                          <div key={section.title}>
                            <Link className="text-sm font-semibold text-gray-900 w-full py-2 hover:text-amber-500" href={`/${section.title}`}>{section.title}</Link>
                            <ul className="mt-2 space-y-1">
                              {section.items.map(item => (
                                <li key={item.name}>
                                  {item.subItems && item.subItems.length > 0 && (
                                    <ul className="mt-1 space-y-1">
                                      {item.subItems.map(sub => (
                                        <li key={sub.name}>
                                          <Link href={sub.href || '#'} className="block p-2 text-sm text-gray-600 hover:bg-gray-100">
                                            {sub.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/build-house"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                Build your house
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                Projects
              </Link>

              <Link
                href="/shops"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                Shops
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-5">
            <Link
              href="/help"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              <p>Help</p>

            </Link>
             {/* Notification Icon (client only) */}
             {isClient && (
              <NotificationIcon
                count={getUnreadCount()}
                onClick={handleNotificationClick}
                className="text-amber-600 hover:text-amber-700"
              />
            )}

            <Link
              href="/cart"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              <ShoppingCart />
            </Link>
            {/* Conditionally render based on isClient and localUserData */}
            {isClient && (
              localUserData ? (
                userRole === "ADMIN" || userRole === "SELLER" ? (
                  <Profile
                    NK={""}
                    userName={userName || ""}
                    userEmail={userEmail || ""}
                  />
                ) : (
                  <CustomerProfile/>
                )
              ) : (
                <Link href="/signin" className="border-l-1">
                  <p className="pl-5 px-4 py-2 hover:text-yellow-400 font-medium">
                    Sign In
                  </p>
                </Link>
              )
            )}
            <FlagToggle />
          </div>
        </div>
      </div>
       {/* Notification Modal (client only) */}
       {isClient && (
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={handleNotificationClose}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          isLoading={notificationsLoading}
          error={notificationsError}
        />
      )}
    </nav>
  );
};

export default Navbar;