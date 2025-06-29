"use client";

import React, { useState, useEffect } from "react";
import { Building2, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { navItems, NavItem } from "@/app/utils/fakes/NavFakes";
import Link from "next/link";
import FlagToggle from "@/app/(components)/Navbar/ToggleFlag";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Profile from "@/app/(components)/Navbar/Profile";
import { useUserStore } from "@/store/userStore";
import CustomerProfile from "@/app/(components)/Navbar/CustomerProfile";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { NotificationIcon } from "@/components/ui/notification-icon";
import { NotificationModal } from "@/components/ui/notification-modal";
import { useNotificationStore } from "@/store/notificationStore";

interface ThirdLevelItemProps {
  item: { name: string; href?: string };
}

const ThirdLevelItem: React.FC<ThirdLevelItemProps> = ({ item }) => (
  <li key={item.name}>
    {item.href ? (
      <Link
        href={item.href}
        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
      >
        {item.name}
      </Link>
    ) : (
      <span className="block px-4 py-2 text-sm text-gray-600">{item.name}</span>
    )}
  </li>
);

interface SecondLevelItemProps {
  item: {
    name: string;
    href?: string;
    subItems?: { name: string; href?: string }[];
  };
}

const SecondLevelItem: React.FC<SecondLevelItemProps> = ({ item }) => {
  const [showSubMenu, setShowSubMenu] = useState(false);

  return (
    <li
      key={item.name}
      className="relative group"
      onMouseEnter={() => setShowSubMenu(true)}
      onMouseLeave={() => setShowSubMenu(false)}
    >
      {item.href ? (
        <Link
          href={item.href}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:text-gray-900 flex justify-between items-center"
        >
          {item.name}
          {item.subItems && item.subItems.length > 0 && (
            <ChevronRight className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </Link>
      ) : (
        <div className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:text-gray-900 flex justify-between items-center">
          {item.name}
          {item.subItems && item.subItems.length > 0 && (
            <ChevronRight className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </div>
      )}
      <AnimatePresence>
        {showSubMenu && item.subItems && item.subItems.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute left-full top-0 z-20 bg-white shadow-md rounded-md w-48"
          >
            {item.subItems.map((subItem) => (
              <ThirdLevelItem key={subItem.name} item={subItem} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

interface FirstLevelSectionProps {
  section: {
    title: string;
    items: {
      name: string;
      href?: string;
      subItems?: { name: string; href?: string }[];
    }[];
  };
}

const FirstLevelSection: React.FC<FirstLevelSectionProps> = ({ section }) => (
  <div key={section.title}>
    <h3 className="text-sm font-semibold text-gray-900 w-full py-2">
      {section.title}
    </h3>
    <ul className="mt-2 space-y-1">
      {section.items.map((secondLevelItem) => (
        <SecondLevelItem key={secondLevelItem.name} item={secondLevelItem} />
      ))}
    </ul>
  </div>
);

interface MenuItemProps {
  item: NavItem;
  activeMenu: string | null;
  handleMenuClick: (label: string, event: React.MouseEvent) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  activeMenu,
  handleMenuClick,
}) => {
  return (
    <div key={item.label} className="relative nav-menu">
      <button
        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
        onClick={(e) => handleMenuClick(item.label, e)}
      >
        {item.label}
        {activeMenu === item.label ? (
          <ChevronUp className="ml-1 h-4 w-4 transition-transform duration-200" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
        )}
      </button>

      {/* First level dropdown menu */}
      <AnimatePresence>
        {activeMenu === item.label && item.items && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute left-0 z-10 mt-2 w-screen max-w-[780px] bg-white shadow-2xl"
          >
            <div className="grid grid-cols-3 gap-8 p-8">
              {item.items.map((firstLevelSection) => (
                <FirstLevelSection
                  key={firstLevelSection.title}
                  section={firstLevelSection}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  type UserData = { role?: string; name?: string; email?: string };
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);

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

  // Track client and local storage user data
  useEffect(() => {
    setIsClient(true);
    setLocalUserData(getUserDataFromLocalStorage());
    // Only add "click outside" listener after mount
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-menu")) setActiveMenu(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch notifications only when client and user data are set
  useEffect(() => {
    if (isClient && localUserData) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, localUserData]);

  const handleMenuClick = (label: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === label ? null : label);
  };

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

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-semibold">KVV Pro</span>
              </div>
            </Link>

            {/* Main navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  activeMenu={activeMenu}
                  handleMenuClick={handleMenuClick}
                />
              ))}
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
            {isClient &&
              (localUserData ? (
                userRole === "ADMIN" || userRole === "SELLER" ? (
                  <Profile
                    NK={""}
                    userName={userName || ""}
                    userEmail={userEmail || ""}
                  />
                ) : (
                  <CustomerProfile
                    NK={""}
                    userName={userName || ""}
                    userEmail={userEmail || ""}
                  />
                )
              ) : (
                <Link href="/signin" className="border-l-1">
                  <p className="pl-5 px-4 py-2 hover:text-yellow-400 font-medium">
                    Sign In
                  </p>
                </Link>
              ))}
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
