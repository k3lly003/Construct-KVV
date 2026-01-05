"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Menu,
  X,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import FlagToggle from "@/app/(components)/Navbar/ToggleFlag";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
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
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubSheet, setActiveSubSheet] = useState<{
    name: string;
    subItems: { name: string; href: string }[];
  } | null>(null);
  const [localUserData, setLocalUserData] = useState<unknown>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExploreServicesOpen, setMobileExploreServicesOpen] =
    useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const { getCartCount } = useCartStore();
  const { isAuthenticated } = useAuth();
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the home page
  const isHomePage = pathname === '/home' || pathname === '/';

  // Get user data from Zustand store
  const { role: userRole, name: userName, email: userEmail } = useUserStore();
  // Get notification data from store
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    fetchNotifications,
    clearNotifications,
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

  // Clear notifications when user logs out
  useEffect(() => {
    if (isClient && !isAuthenticated) {
      clearNotifications();
    }
  }, [isClient, isAuthenticated, clearNotifications]);

  const handleNotificationClick = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please log in to view notifications");
      return;
    }

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

  const ExploreServicesSections = parentCategories.map((parent) => ({
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuClick = (label: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === label ? null : label);
  };

  return (
    <nav className={`transition-all duration-300 ${
      isHomePage 
        ? `fixed top-0 left-0 right-0 z-50 ${
            scrolled 
              ? 'bg-white/95 backdrop-blur-md shadow-md' 
              : 'bg-transparent'
          }` 
        : 'bg-white border-b'
    }`}>
      <div className="max-w-7xl mx-auto flex-flex-col gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between py-2 items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <div className="flex-shrink-0 flex items-center mr-5">
                <Image
                  src="/kvv-logo.png"
                  alt="KVV Pro"
                  width={42}
                  height={42}
                  className={`transition-all ${
                    isHomePage && !scrolled ? 'drop-shadow-lg' : ''
                  }`}
                />
                <span className={`ml-2 text-mid font-semibold transition-colors ${
                  isHomePage && !scrolled ? 'text-white' : 'text-amber-500'
                }`}>
                  kvv
                </span>
              </div>
            </Link>
          </div>

          {/* Right side buttons (desktop only) and hamburger (mobile only) */}
          <div className="flex items-center space-x-5">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-5">
              <Link
                href="/join-as-pro"
                className={`inline-flex items-center px-1 pt-1 text-md font-medium transition-colors ${
                  isHomePage && !scrolled 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-gray-900 hover:text-amber-500'
                }`}
              >
                {t("navigation.join-as-a-pro")}
                <BriefcaseBusiness className="mx-2 w-5 h-5" />
              </Link>
              {/* Notification Icon (authenticated users only) */}
              {isClient && isAuthenticated && (
                <NotificationIcon
                  count={getUnreadCount()}
                  onClick={handleNotificationClick}
                  className={`transition-colors ${
                    isHomePage && !scrolled
                      ? 'text-white hover:text-amber-300'
                      : 'text-amber-600 hover:text-amber-700'
                  }`}
                  isLoading={notificationsLoading}
                />
              )}
              <Link
                href="/cart"
                className={`inline-flex items-center px-1 pt-1 text-small font-medium relative transition-colors ${
                  isHomePage && !scrolled
                    ? 'text-white hover:text-amber-300'
                    : 'text-gray-900 hover:text-amber-600'
                }`}
              >
                <ShoppingCart />
                {isClient && getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-small rounded-full px-2 py-0.5 font-bold">
                    {getCartCount()}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
              {/* Conditionally render based on isClient and localUserData */}
              {isClient &&
                (localUserData ? (
                  userRole === "CUSTOMER" ? (
                    <CustomerProfile />
                  ) : (
                    <Profile
                      NK={""}
                      userName={userName || ""}
                      userEmail={userEmail || ""}
                    />
                  )
                ) : (
                  <Link href="/signin" className="border-l-1">
                    <p className={`pl-5 px-4 py-2 font-medium transition-colors ${
                      isHomePage && !scrolled
                        ? 'text-white hover:text-amber-300'
                        : 'text-gray-900 hover:text-yellow-400'
                    }`}>
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
              <Menu className={`h-7 w-7 transition-colors ${
                isHomePage && !scrolled ? 'text-white' : 'text-amber-500'
              }`} />
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
                  className="w-72 h-full  shadow-xl bg-white p-6 flex flex-col gap-6 relative"
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
                        width={100}
                        height={100}
                        className="text-mid"
                      />
                      <span className="ml-2 text-mid text-amber-500 font-semibold">
                        kvv
                      </span>
                    </div>
                  </Link>
                  {/* Explore Service collapsible for mobile */}
                  <div className="border-b">
                    <button
                      className="w-full flex items-center justify-between py-2 text-gray-900 hover:text-amber-500 focus:outline-none"
                      onClick={() =>
                        setMobileExploreServicesOpen((prev) => !prev)
                      }
                      aria-expanded={mobileExploreServicesOpen}
                      aria-controls="mobile-explore-service-menu"
                    >
                      <span>
                        {t("navigation.Explore-Services", "Explore Services")}
                      </span>
                      {mobileExploreServicesOpen ? (
                        <ChevronUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      )}
                    </button>
                    {mobileExploreServicesOpen && (
                      <div
                        id="mobile-explore-service-menu"
                        className="pl-4 py-2 space-y-2"
                      >
                        {ExploreServicesSections.map((section) => (
                          <div key={section.title}>
                            <Link
                              href={`/${section.title}`}
                              className="block text-small font-semibold text-gray-900 py-1 hover:text-amber-500"
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
                                          className="block text-small text-gray-600 hover:text-amber-500 py-1"
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
                  {/* <button
                    type="button"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b bg-transparent w-full text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (!localUserData) {
                        toast.error(
                          "Please sign in first to access build house"
                        );
                        router.push("/signin");
                      } else {
                        router.push("/build-house");
                      }
                    }}
                  >
                    Build your house
                  </button> */}
                  {/* Projects link (mobile) */}
                  <button
                    type="button"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b bg-transparent w-full text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (!localUserData) {
                        toast.error("Please sign in first to access projects");
                        // router.push("/signin");
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
                  {/* <Link
                    href="/pricing"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricings
                  </Link> */}
                  <Link
                    href="/help"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link
                    href="/design-marketplace"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navigation.designMarketPlace")|| "Desing market place"}
                  </Link>
                  <Link
                    href="/cart"
                    className="py-2 text-gray-900 hover:text-amber-500 border-b flex items-center gap-2 relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {isClient && getCartCount() > 0 && (
                      <span className="absolute -top-2 left-5 bg-amber-500 text-white text-small rounded-full px-2 py-0.5 font-bold">
                        {getCartCount()}
                      </span>
                    )}
                    Cart
                  </Link>
                  {/* Notification Icon (authenticated users only) */}
                  {isClient && isAuthenticated && (
                    <div className="py-2 border-b">
                      <NotificationIcon
                        count={getUnreadCount()}
                        onClick={() => {
                          handleNotificationClick();
                          setMobileMenuOpen(false);
                        }}
                        className="text-amber-600 hover:text-amber-700"
                        isLoading={notificationsLoading}
                      />
                    </div>
                  )}
                  {/* Auth/Profile */}
                  {isClient &&
                    (localUserData ? (
                      userRole === "CUSTOMER" ? (
                        <CustomerProfile />
                      ) : (
                        <Profile
                          NK={""}
                          userName={userName || ""}
                          userEmail={userEmail || ""}
                        />
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
        <div>
          {/* Main navigation (desktop only) */}
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <div className="relative nav-menu">
              <button
                className={`inline-flex items-center cursor-pointer py-3 text-small font-medium transition-colors ${
                  isHomePage && !scrolled 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-gray-900 hover:text-amber-500'
                }`}
                onClick={(e) => handleMenuClick("Explore Services", e)}
              >
                {t("navigation.explore-services", "Explore Services")}
                {activeMenu === "Explore Services" ? (
                  <ChevronUp className="ml-1 h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                )}
              </button>
              <AnimatePresence>
                {activeMenu === "Explore Services" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute left-0 z-20 mt-2 w-screen max-w-[800px] bg-white border border-gray-200 rounded-lg shadow-lg"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-6">
                        {ExploreServicesSections.map((section, index) => (
                          <div
                            key={section.title}
                            className={`${
                              index !== ExploreServicesSections.length - 1
                                ? "border-r border-gray-100 pr-6"
                                : ""
                            }`}
                          >
                            <div className="mb-4">
                              <Link
                                className="text-small font-semibold text-gray-900 hover:text-amber-500 transition-colors duration-200"
                                href={`/${section.title}`}
                                onClick={() => setActiveMenu(null)}
                              >
                                {section.title}
                              </Link>
                            </div>
                            <ul className="mt-2 space-y-1">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  {item.subItems && item.subItems.length > 0 ? (
                                    <>
                                      {/* Mobile: Show button with sheet */}
                                      {isMobile ? (
                                        <>
                                          <button
                                            className="block p-2 text-small text-gray-600 hover:bg-gray-100 w-full text-left"
                                            onClick={() =>
                                              setActiveSubSheet(item)
                                            }
                                          >
                                            {item.name}{" "}
                                            <span className="ml-2 text-small text-gray-400">
                                              (see more)
                                            </span>
                                          </button>
                                          <Sheet
                                            open={Boolean(
                                              activeSubSheet &&
                                                activeSubSheet.name ===
                                                  item.name
                                            )}
                                            onOpenChange={(open) => {
                                              if (!open)
                                                setActiveSubSheet(null);
                                            }}
                                          >
                                            <SheetContent
                                              side="right"
                                              className="w-[360px]"
                                            >
                                              <SheetHeader>
                                                <SheetTitle>
                                                  {item.name}
                                                </SheetTitle>
                                                <SheetDescription>
                                                  Select an option
                                                </SheetDescription>
                                              </SheetHeader>
                                              <ul className="my-4 space-y-2">
                                                {item.subItems.map((sub) => (
                                                  <li key={sub.name}>
                                                    <Link
                                                      href={sub.href || "#"}
                                                      className="block py-2 px-3 rounded text-gray-700 hover:bg-amber-100"
                                                      onClick={() => {
                                                        setActiveSubSheet(null);
                                                        setActiveMenu(null);
                                                      }}
                                                    >
                                                      {sub.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                              <SheetFooter>
                                                <SheetClose asChild>
                                                  <button className="text-amber-600 hover:underline">
                                                    Close
                                                  </button>
                                                </SheetClose>
                                              </SheetFooter>
                                            </SheetContent>
                                          </Sheet>
                                        </>
                                      ) : (
                                        /* Desktop: Show subItems directly */
                                        <div className="space-y-1">
                                          {item.subItems.map((sub) => (
                                            <Link
                                              key={sub.name}
                                              href={sub.href || "#"}
                                              className="block px-3 py-2 text-small text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-all duration-200"
                                              onClick={() =>
                                                setActiveMenu(null)
                                              }
                                            >
                                              {sub.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <Link
                                      href={item.href || "#"}
                                      className="block p-2 text-small text-gray-600 hover:bg-gray-100"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Build House link (desktop) */}
            {/* <button
              type="button"
              className="inline-flex items-center px-1 pt-1 mb-2 hover:text-amber-500 text-small font-medium text-gray-900"
              onClick={() => {
                if (!localUserData) {
                  toast.error("Please sign in first to access build house");
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
            </button> */}
            {/* Projects link (desktop) */}
            <button
              type="button"
              className={`inline-flex items-center px-1 pt-1 mb-2 text-small font-medium transition-colors ${
                isHomePage && !scrolled 
                  ? 'text-white hover:text-amber-300' 
                  : 'text-gray-900 hover:text-amber-500'
              }`}
              onClick={() => {
                if (!localUserData) {
                  toast.error("Please sign in first to access projects");
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
              href="/services"
              className={`inline-flex items-center px-1 pt-1 mb-2 text-small font-medium transition-colors ${
                isHomePage && !scrolled 
                  ? 'text-white hover:text-amber-300' 
                  : 'text-gray-900 hover:text-amber-500'
              }`}
            >
              {t("navigation.portfolio")}
            </Link>
            {/* <Link
              href="/pricing"
              className={`inline-flex items-center px-1 pt-1 mb-2 text-small font-medium transition-colors ${
                isHomePage && !scrolled 
                  ? 'text-white hover:text-amber-300' 
                  : 'text-gray-900 hover:text-amber-500'
              }`}
            >
              {t("navigation.pricing")}
            </Link> */}
            <Link
              href="/design-marketplace"
              className={`inline-flex items-center px-1 pt-1 mb-2 text-small font-medium transition-colors ${
                isHomePage && !scrolled 
                  ? 'text-white hover:text-amber-300' 
                  : 'text-gray-900 hover:text-amber-500'
              }`}
            >
              {t("navigation.designMarketPlace")}
            </Link>
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
