"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Links } from "./Links"
import { useState } from "react"

const MobileMenuBar = () => {
    const [isClicked, setIsClicked] = useState(false);
    const [clickedLink, setClickedLink] = useState("");
    const pathName = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sky-950">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="/dashboard" className="flex items-center gap-4 font-semibold">
                        <Image src="/logo/logo1.png" alt="SheCanCODE Logo" className="p-1 bg-white" width={60} height={60} />
                        <span className="text-white font-extrabold uppercase">Web Manager</span>
                    </Link>
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
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenuBar