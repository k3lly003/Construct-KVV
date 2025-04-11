"use client";

import Link from "next/link"
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Links } from "./Links";
import { useSession } from "next-auth/react";

const SideNavigation = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [clickedLink, setClickedLink] = useState("");
  const pathName = usePathname();
  const { data: session } = useSession();

  console.log(session);

  return (
    <div className="flex-1 bg-sky-950">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {Links?.map((link, index) => (
          <div key={index}>
            <Link
              href={link.pathName}
              onClick={() => {
                setClickedLink(link.label);
                setIsClicked(!isClicked)
              }}
              className={cn(pathName === link.pathName ? "bg-sky-600" : "", "flex items-center justify-between rounded-lg px-3 py-2 text-sky-200 transition-all hover:text-sky-200")}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.label}</span>
              </div>
              {link.hasSubLinks && <span><ChevronDown className={cn((isClicked && clickedLink === link.label) ? "rotate-180 ease-in-out duration-700" : "")} /></span>}
            </Link>
            <div className={cn((isClicked && clickedLink === link.label) ? "flex flex-col gap-1 pl-5 bg-sky-900 duration-1000 ease-in-out" : "hidden")}>
              {link.subLinks?.map((subLink, index) => (
                <Link
                  key={index}
                  href={subLink.pathName}
                  className={cn(pathName === subLink.pathName ? "bg-sky-700" : "", "flex items-center justify-between rounded-lg px-3 py-2 text-sky-200 transition-all hover:text-sky-200")}
                >
                  <div className="flex items-center gap-3">
                    {subLink.icon}
                    <span>{subLink.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default SideNavigation