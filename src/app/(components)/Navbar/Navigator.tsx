"use client";

import React, { useState } from "react";
import { Building2, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { navItems } from "../../utils/fakes/NavFakes";
import Link from "next/link";

export const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
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

                  {/* Dropdown menu */}
                  {activeMenu === item.label && item.items && (
                    <div className="absolute left-0 z-10 mt-2 w-screen max-w-[1000px] bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="grid grid-cols-4 gap-8 p-8">
                        {item.items.map((section) => (
                          <div key={section.title}>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                              {section.title}
                            </h3>
                            <ul className="mt-4 space-y-4">
                              {section.items.map((subItem) => (
                                <li key={subItem.name} className="relative">
                                  <a
                                    href="#"
                                    className="group flex items-center text-sm text-gray-600 hover:text-gray-900"
                                  >
                                    {subItem.name}
                                    {subItem.isPopular && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        Popular
                                      </span>
                                    )}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/store"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                Store
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
            <Link
              href="/cart"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              <ShoppingCart />
            </Link>
            <Link href="/signin" className="border-l-1">
              <p className="pl-5 px-4 py-2 hover:text-yellow-400 font-medium">
                Sign In
              </p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
