"use client";

import Navbar from "../dashboard/(components)/Navbar";
import SideBar from "../dashboard/(components)/SideBar";
import { useGlobalStore } from "../../store";
import { ThemeProvider } from "../../components/ui/theme-provider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useGlobalStore((state) => state.isSidebarCollapsed);

  return (
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <SideBar />
        <main
          className={`flex-col w-full py-7 px-9 bg-gray-50 dark:bg-gray-800 ${
            isSidebarCollapsed ? "md:pl-24" : "md:pl-80"
          }`}
        >
          <Navbar />
          {children}
        </main>
      </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
};

export default DashboardWrapper;
