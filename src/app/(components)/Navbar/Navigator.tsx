"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ShoppingCart, Menu, X } from "lucide-react";
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
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [localUserData, setLocalUserData] = useState<unknown>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const { t, ready } = useTranslation();
  const { getCartCount } = useCartStore();
  const isClient = useIsClient();
  const router = useRouter();

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
  const parentCategories = categories.filter((cat) => !cat.parentId);
  const subCategoriesMap = categories
    .filter((cat) => typeof cat.parentId === "string" && cat.parentId)
    .reduce((acc, sub) => {
      if (!acc[sub.parentId!]) acc[sub.parentId!] = [];
      acc[sub.parentId!].push(sub);
      return acc;
    }, {} as Record<string, typeof categories>);

  const featuresSections = parentCategories.map((parent) => ({
    title: parent.name,
    items: [
      {
        name: parent.name,
        href: `/category/${parent.slug || parent.id}`,
        subItems: (subCategoriesMap[parent.id] || []).map((sub) => ({
          name: sub.name,
          href: `/category/${parent.slug || parent.id}/${sub.slug || sub.id}`,
        })),
      },
    ],
  }));

  useEffect(() => {
    // This code only runs on the client after hydration
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
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <div className="flex-shrink-0 flex items-center mr-5">
                <Image
                  src="/kvv-logo.png"
                  alt="KVV Pro"
                  width={42}
                  height={42}
                />
                <span className="ml-2 text-xl text-amber-500 font-semibold">
                  kvv
                </span>
              </div>
            </Link>
            {/* Main navigation (desktop only) */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <div className="relative nav-menu">
                <button
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  onClick={(e) => handleMenuClick("Features", e)}
                >
                  {t("navigation.features", "Features")}
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
                        {featuresSections.map((section) => (
                          <div key={section.title}>
                            <Link
                              className="text-sm font-semibold text-gray-900 w-full py-2 hover:text-amber-500"
                              href={`/${section.title}`}
                            >
                              {section.title}
                            </Link>
                            <ul className="mt-2 space-y-1">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  {item.subItems &&
                                    item.subItems.length > 0 && (
                                      <ul className="mt-1 space-y-1">
                                        {item.subItems.map((sub) => (
                                          <li key={sub.name}>
                                            <Link
                                              href={sub.href || "#"}
                                              className="block p-2 text-sm text-gray-600 hover:bg-gray-100"
                                            >
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
              {/* Build House link (desktop) */}
              <button
                type="button"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300 bg-transparent"
                onClick={() => {
                  if (!localUserData) {
                    router.push("/signin");
                  } else {
                    router.push("/build-house");
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("navigation.buildHouse")}
              </button>
              {/* Projects link (desktop) */}
              <button
                type="button"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300 bg-transparent"
                onClick={() => {
                  if (!localUserData) {
                    router.push("/signin");
                  } else {
                    router.push("/projects");
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("navigation.projects")}
              </button>
              <Link
                href="/shops"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                {t("navigation.shops")}
              </Link>
            </div>
          </div>

          {/* Right side buttons (desktop only) and hamburger (mobile only) */}
          <div className="flex items-center space-x-5">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-5">
              <Link
                href="/help"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                {t("navigation.help")}
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
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300 relative"
              >
                <ShoppingCart />
                {isClient && getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {getCartCount()}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
              {/* Conditionally render based on isClient and localUserData */}
              {isClient &&
                (localUserData ? (
                  userRole === "ADMIN" || userRole === "SELLER" ? (
                    <Profile
                      NK={""}
                      userName={userName || ""}
                      userEmail={userEmail || ""}
                    />
                  ) : (
                    <CustomerProfile />
                  )
                ) : (
                  <Link href="/signin" className="border-l-1">
                    <p className="pl-5 px-4 py-2 hover:text-yellow-400 font-medium">
                      {t("navigation.login")}
                    </p>
                  </Link>
                ))}
              <FlagToggle />
            </div>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-7 w-7 text-amber-500" />
            </button>
          </div>

          {/* Hamburger mobile menu overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 bg-transparent bg-opacity-20 flex justify-end md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.25 }}
                  className="w-72 h-full bg-white shadow-xl p-6 flex flex-col gap-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6 text-amber-500" />
                  </button>
                  {/* Logo */}
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center mb-4">
                      <Image
                        src="/kvv-logo.png"
                        alt="KVV Pro"
                        width={36}
                        height={36}
                      />
                      <span className="ml-2 text-lg text-amber-500 font-semibold">
                        kvv
                      </span>
                    </div>
                  </Link>
                  {/* Features collapsible for mobile */}
                  <div className="border-b">
                    <button
                      className="w-full flex items-center justify-between py-2 text-gray-900 hover:text-amber-500 focus:outline-none"
                      onClick={() => setMobileFeaturesOpen((prev) => !prev)}
                      aria-expanded={mobileFeaturesOpen}
                      aria-controls="mobile-features-menu"
                    >
                      <span>{t("navigation.features", "Features")}</span>
                      {mobileFeaturesOpen ? (
                        <ChevronUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      )}
                    </button>
                    {mobileFeaturesOpen && (
                      <div
                        id="mobile-features-menu"
                        className="pl-4 py-2 space-y-2"
                      >
                        {featuresSections.map((section) => (
                          <div key={section.title}>
                            <Link
                              href={`/${section.title}`}
                              className="block text-sm font-semibold text-gray-900 py-1 hover:text-amber-500"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {section.title}
                            </Link>
                            {section.items.map((item) => (
                              <div key={item.name}>
                                {item.subItems && item.subItems.length > 0 && (
                                  <ul className="ml-3 border-l border-gray-200 pl-2 mt-1 space-y-1">
                                    {item.subItems.map((sub) => (
                                      <li key={sub.name}>
                                        <Link
                                          href={sub.href || "#"}
                                          className="block text-sm text-gray-600 hover:text-amber-500 py-1"
                                          onClick={() =>
                                            setMobileMenuOpen(false)
                                          }
                                        >
                                          {sub.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Build House link (mobile) */}
                  <button
                    type="button"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b bg-transparent w-full text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (!localUserData) {
                        router.push("/signin");
                      } else {
                        router.push("/build-house");
                      }
                    }}
                  >
                    Build your house
                  </button>
                  {/* Projects link (mobile) */}
                  <button
                    type="button"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b bg-transparent w-full text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (!localUserData) {
                        router.push("/signin");
                      } else {
                        router.push("/projects");
                      }
                    }}
                  >
                    Projects
                  </button>
                  <Link
                    href="/shops"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shops
                  </Link>
                  <Link
                    href="/help"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link
                    href="/cart"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b flex items-center gap-2 relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {isClient && getCartCount() > 0 && (
                      <span className="absolute -top-2 left-5 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                        {getCartCount()}
                      </span>
                    )}
                    Cart
                  </Link>
                  {/* Notification Icon (client only) */}
                  {isClient && (
                    <div className="py-2 border-b">
                      <NotificationIcon
                        count={getUnreadCount()}
                        onClick={() => {
                          handleNotificationClick();
                          setMobileMenuOpen(false);
                        }}
                        className="text-amber-600 hover:text-amber-700"
                      />
                    </div>
                  )}
                  {/* Auth/Profile */}
                  {isClient &&
                    (localUserData ? (
                      userRole === "ADMIN" || userRole === "SELLER" ? (
                        <Profile
                          NK={""}
                          userName={userName || ""}
                          userEmail={userEmail || ""}
                        />
                      ) : (
                        <CustomerProfile />
                      )
                    ) : (
                      <Link
                        href="/signin"
                        className="py-2 text-gray-900 hover:text-amber-500 border-b"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    ))}
                  <div className="py-2">
                    <FlagToggle />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
