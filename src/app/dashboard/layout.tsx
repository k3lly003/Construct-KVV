import "../globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserStoreInitializer, DashboardStoreInitializer } from "../../store";
import { QueryProviders } from "../provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <QueryProviders>
          <UserStoreInitializer />
          <DashboardStoreInitializer />
          <DashboardWrapper>{children}</DashboardWrapper>
          <SpeedInsights />
        </QueryProviders>
    </>
  );
}
