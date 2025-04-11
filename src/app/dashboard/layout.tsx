import "@/styles/globals.css";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SideNavigation from "./_components/SideNavigation";
import MobileMenuBar from "./_components/MobileMenuBar";
import Image from "next/image";
import { Toaster } from "sonner";
import LougoutButton from "./_components/LougoutButton";
import UserProfileIcon from "./_components/UserProfileIcon";
import { AuthProvider } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import ProgressBarProvider from "@/app/ProgressiveBarProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode } from "react";

export const metadata = {
    title: "kvv shop Dashboard",
};

interface RootLayoutProps{
    children: ReactNode
}
export default function RootLayout({ children }:RootLayoutProps) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <ProgressBarProvider>
                    <AuthProvider>
                        <Toaster position="top-right" />
                        <div className="min-h-screen w-full flex justify-between">
                            <div className="hidden border-r bg-muted/40 md:block h-screen fixed sm:w-2/5 md:w-1/5">
                                {/* Side Bar  */}
                                <div className="flex h-full max-h-screen flex-col gap-2 bg-sky-950">
                                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                                        <Link href="/dashboard" className="flex items-center gap-4 font-semibold">
                                            <Image src="/logo/logo1.png" alt="SheCanCODE Logo" className="p-1 bg-white" width={60} height={60} />
                                            <span className="text-white font-extrabold uppercase">Web Manager</span>
                                        </Link>
                                    </div>
                                    {/* Side Navigation Bar */}
                                    <SideNavigation />
                                </div>
                            </div>

                            <div className="flex flex-col overflow-y-scroll w-full md:w-4/5 fixed right-0 top-0 z-50 h-screen">
                                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                                    <MobileMenuBar />
                                    <div className="w-full flex-1">
                                        <h3 className="text-lg font-semibold">Admin</h3>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="rounded-full">
                                                <UserProfileIcon />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                <Link href="/dashboard/profile" className="flex items-center gap-2">Profile</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Settings</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <LougoutButton />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </header>
                                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-200 overflow-y-auto">
                                    {children}
                                    <SpeedInsights />
                                </main>
                            </div>
                        </div>
                    </AuthProvider>
                </ProgressBarProvider>
            </body>
        </html>
    );
}
