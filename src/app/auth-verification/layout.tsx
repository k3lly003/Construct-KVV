import type { Metadata } from "next";
import "../globals.css";
import ProgressBarProvider from "@/app/progresiveBarProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: {
    template: 'kvv shop',
    default: 'kvv shop',
  },
  description: 'Welcome to the best construction e-commerce in Rwanda.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/logo/logo1.png" type="image/png" />
      <meta name="keywords" content="construction kvv, construction kvv shop, construction kvv, kvv, e-commerce, construction, real estate in Rwanda, kvv Rwanda, Rwanda, construction e-commerce" />
      <meta property="og:title" content="construction kvv shop" />
      <meta property="og:description" content="Welcome to the best online construction shop in Rwanda." />
      <meta property="og:image" content="/F9.jpeg" />
    </head>
    <body className="flex flex-col justify-start">
      <Suspense fallback={<div>Loading...</div>}>
      <ProgressBarProvider>
        {children}
      </ProgressBarProvider>
      </Suspense>
      <SpeedInsights />
    </body>
  </html>
  );
}
