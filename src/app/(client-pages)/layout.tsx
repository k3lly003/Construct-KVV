"use client"

import { Suspense } from "react"
import ProgressBarProvider from "@/app/(components)/ProressBarProvider"
import { UserStoreInitializer } from "@/store/userStore"
import Navbar from "@/app/(components)/Navbar/Navigator"
import { Footer } from "@/app/(components)/footer/Footer"
import ChatWidget from "@/app/(components)/chat/ChatWidget"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UserStoreInitializer />
      <Suspense>
        <ProgressBarProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </ProgressBarProvider>
      </Suspense>
      <SpeedInsights />
    </>
  )
}