"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import { Building2, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { navItems, NavItem } from "@/app/utils/fakes/NavFakes";
import Link from "next/link";
import FlagToggle from "@/app/(components)/Navbar/ToggleFlag";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "@/app/(components)/Navbar/Profile";
import { useUserStore } from "@/store/userStore";
import CustomerProfile from "@/app/(components)/Navbar/CustomerProfile";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { useTranslation } from "react-i18next";


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
        </Link>
      ) : (
        <div className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:text-gray-900 flex justify-between items-center">
          {item.name}
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
              <li key={subItem.name}>
                {subItem.href ? (
                  <Link
                    href={subItem.href}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {subItem.name}
                  </Link>
                ) : (
                  <span className="block px-4 py-2 text-sm text-gray-600">{subItem.name}</span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

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
              {item.items?.map((firstLevelSection) => (
                <div key={firstLevelSection.title}>
                  <h3 className="text-sm font-semibold text-gray-900 w-full py-2">
                    {firstLevelSection.title}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {firstLevelSection.items.map((secondLevelItem) => (
                      <SecondLevelItem key={secondLevelItem.name} item={secondLevelItem} />
                    ))}
                  </ul>
                </div>
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
  const [isClient, setIsClient] = useState(false); // New state to track if on client
  const [localUserData, setLocalUserData] = useState<unknown>(null); // New state for local user data
  const { t, ready } = useTranslation();

  // Get user data from Zustand store
  const { role: userRole, name: userName, email: userEmail } = useUserStore();

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

  // Fallback text for when translations aren't ready
  const getText = (key: string, fallback: string) => {
    if (isClient && ready) {
      return t(key);
    }
    return fallback;
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
                {getText('navigation.buildHouse', 'Build House')}
              </Link>

              <Link
                href="/store"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                {getText('navigation.products', 'Products')}
              </Link>

              <Link
                href="/shops"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                {getText('navigation.shops', 'Shops')}
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-5">
            <Link
              href="/help"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              <p>{getText('navigation.help', 'Help')}</p>
            </Link>
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
                  <CustomerProfile />
                )
              ) : (
                <Link href="/signin" className="border-l-1">
                  <p className="pl-5 px-4 py-2 hover:text-yellow-400 font-medium">
                    {getText('navigation.login', 'Sign In')}
                  </p>
                </Link>
              )
            )}
            <FlagToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;