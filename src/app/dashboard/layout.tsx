import "../globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserStoreInitializer } from "../../store/userStore";
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
          <DashboardWrapper>{children}</DashboardWrapper>
          <SpeedInsights />
        </QueryProviders>
    </>
  );
}
