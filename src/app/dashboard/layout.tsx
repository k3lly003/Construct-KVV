import "../globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserStoreInitializer, DashboardStoreInitializer } from "../../store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserStoreInitializer />
      <DashboardStoreInitializer />
      <DashboardWrapper>{children}</DashboardWrapper>
      <SpeedInsights />
    </>
  );
}
