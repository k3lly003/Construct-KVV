import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserStoreInitializer } from "../../store/userStore";
import { QueryProviders } from "../provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kvv management Dashboard",
  description: "e-commerce website for construction based products & services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProviders>
          <UserStoreInitializer />
          <DashboardWrapper>{children}</DashboardWrapper>
          <SpeedInsights />
        </QueryProviders>
      </body>
    </html>
  );
}
