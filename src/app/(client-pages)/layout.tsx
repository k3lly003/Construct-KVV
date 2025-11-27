"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import ProgressBarProvider from "@/app/(components)/ProressBarProvider";
import { UserStoreInitializer } from "@/store/userStore";
import Navbar from "@/app/(components)/Navbar/Navigator";
import { Footer } from "@/app/(components)/footer/Footer";
import ChatWidget from "@/app/(components)/chat/ChatWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useCartHydration } from "@/store/cartStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useCartHydration();
  const pathname = usePathname();
  const isHomePage = pathname === '/home' || pathname === '/';
  
  return (
    <>
      <UserStoreInitializer />
      <Suspense>
        <ProgressBarProvider>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50">
            <Navbar />
            <main className={`flex-grow ${isHomePage ? '' : ''}`}>{children}</main>
            <Footer />
            <ChatWidget />
          </div>
        </ProgressBarProvider>
      </Suspense>
      <SpeedInsights />
    </>
  );
}
