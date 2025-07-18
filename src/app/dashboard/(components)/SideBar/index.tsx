"use client";

import { useAppDispatch, useAppSelector } from "../../../redux";
import { setIsSidebarCollapsed } from "../../../../state";
import {
  LucideIcon,
  Menu,
  LayoutDashboard,
  LogOut,
  CircleHelp,
  Settings,
  Store,
  Tag,
  Bell,
  TableProperties,
  Package,
  User, // New icon for Profile
  Layers,
  DollarSign, // New icon for Sales Report
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomSheet from "../shad_/CustomSheet";
import Image from "next/image";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/app/hooks/useTranslations';


interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  hoverColor?: string;
  onClick?: () => void;
}
const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onClick,
}: SidebarLinkProps) => {
  const pathname = usePathname(); //This help use to know / determine which path / page or url we're on
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  const content = (
    <div
      className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
      hover:text-white hover:bg-yellow-200 dark:hover:bg-yellow-500 gap-5 transition-colors ${isActive ? "bg-amber-200 text-black" : ""
        } hover:text-white`}
    >
      {/* I've put '!' to make it over ride any other css style */}
      <Icon className="w-6 h-6 !text-gray-700 dark:!text-gray-500" />
      <span
        className={`${isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700 dark:text-gray-500`}
      >
        {label}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
};


const SideBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslations();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const USER = getUserDataFromLocalStorage();
  const userRole = USER ? USER.role : null;
  const isLoggedIn = !!USER;

  const toogleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const sidebarClassName = `fixed flex flex-col bg-white dark:bg-gray-800 z-30 ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
    }transition-all duration-500 overflow-hidden h-full shadow-md dark:shadow-2xl`;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
    }
  }, [isLoggedIn, router]);

  return (
    <div className={sidebarClassName}>
      {/* TOP LOGO */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <div
            className={`flex gap-3 md:justify-normal items-center p-5 ${isSidebarCollapsed ? "px-5" : "px-8"
              }`}
          >
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={40}
              height={40}
              className={`${isSidebarCollapsed ? "hidden" : "block"
                }`}
            />
            <h1
              className={`${isSidebarCollapsed ? "hidden" : "block"
                } font-extrabold text-2xl `}
            >
              KMS
            </h1>

          </div>
        </Link>
        <button
          className="md:hidden p-5 rounded-full hover:bg-amber-300 dark:hover:bg-amber-600 border flex justify-center self-center items-center mr-5"
          onClick={toogleSidebar}
        >
          <Menu className="w-4 h-4" size={24} />
        </button>
      </div>
      {/* LINKS */}
      <div className="flex-grow mt-8 flex flex-col">
        {/* DASHBOARD LINK (Common) */}
        <div className="mt-10">
          {/* Role-specific links */}
          {userRole === "ADMIN" && (
            <>
              <SidebarLink
                href="/dashboard"
                icon={LayoutDashboard}
                label={t('dashboard.overviews')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/shops"
                icon={Store}
                label={t('navigation.shops')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/categories"
                icon={Tag}
                label={t('navigation.categories', 'Categories')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/users"
                icon={User}
                label={t('navigation.users', 'Users')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/seller-requests"
                icon={Layers}
                label={t('dashboard.sellerRequests')}
                isCollapsed={isSidebarCollapsed}
              />
            </>
          )}

          {userRole === "SELLER" && (
            <>
              <SidebarLink
                href="/dashboard/overview"
                icon={LayoutDashboard}
                label={t('dashboard.overviews')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink

                href="/dashboard/products"
                icon={Package}
                label={t('navigation.products')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/projects"
                icon={TableProperties}
                label={t('navigation.projects')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/profile" // Assuming profile path for sellers
                icon={User}
                label={t('navigation.profile')}
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/dashboard/sales-report" // Assuming sales report path for sellers
                icon={DollarSign}
                label={t('dashboard.salesReport', 'Sales Report')}
                isCollapsed={isSidebarCollapsed}
              />
            </>
          )}

          <SidebarLink
            href="/dashboard/notifications"
            icon={Bell}
            label={t('dashboard.notification','notifications')}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
        <hr className="border border-solid border-gray-300 my-10 w-[80%] flex self-center" />
        <div className="h-[70%]">
          {/* Role-specific Guide/Support link */}
          {userRole === "ADMIN" && (
            <SidebarLink
              href="/dashboard/guide"
              icon={CircleHelp}
              label={t('dashboard.guides')}
              isCollapsed={isSidebarCollapsed}
            />
          )}
          {userRole === "SELLER" && (
            <SidebarLink
              href="/dashboard/support" // Assuming a support page for sellers
              icon={CircleHelp} // Using CircleHelp for support
              label={t('dashboard.support')}
              isCollapsed={isSidebarCollapsed}
            />
          )}

          <SidebarLink
            href="/dashboard/settings"
            icon={Settings}
            label={t('dashboard.settings')}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
      <hr className="border border-solid border-gray-300 my-10 w-[80%] flex self-center" />
      {/* FOOTER */}
      <div
        className={`${isSidebarCollapsed ? "hidden" : "block"
          } flex flex-col gap-5 mb-5`}
      >

        <div className="h-[30%]">
          <SidebarLink
            href="/logout"
            icon={LogOut}
            label={t('navigation.logout')}
            onClick={() => {
              localStorage.clear();
              window.location.href = '/signin';
            }}
            isCollapsed={isSidebarCollapsed}
          />
        </div>

        <p className="mt-7 text-center text-xs text-gray-500">
          &copy; 2024 ntirushwa
        </p>
      </div>
    </div>
  );
};

export default SideBar;