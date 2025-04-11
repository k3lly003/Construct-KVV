import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils"
import { Toaster } from 'sonner'
import Navbar from "./_components/Navbar/Navbar";
import Footer from "./_components/Footer";
import ProgressBarProvider from "../ProgressiveBarProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ReactNode } from "react";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: {
    template: '%s | kvv shop',
    default: 'kvv shop',
  },
  description: 'Welcome to the best construction e-commerce in Rwanda.',
};

interface RootLayoutProps{
    children: ReactNode
}

export default function RootLayout({ children }:RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo/logo1.png" type="image/png" />
        <meta name="keywords" content="construction kvv, construction kvv shop, construction kvv, kvv, e-commerce, construction, real estate in Rwanda, kvv Rwanda, Rwanda, construction e-commerce" />
        <meta property="og:title" content="construction kvv shop" />
        <meta property="og:description" content="Welcome to the best online construction shop in Rwanda." />
        <meta property="og:image" content="/F9.jpeg" />
      </head>
      <body className={cn("flex flex-col justify-start", fontSans.variable)}>
        <ProgressBarProvider>
          <Toaster position="top-right" richColors />
          <Navbar />
          {children}
          <Footer />
        </ProgressBarProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
