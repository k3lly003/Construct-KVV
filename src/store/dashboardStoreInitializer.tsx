"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "./dashboardStore";
import { useUserStore } from "./userStore";

export function DashboardStoreInitializer() {
  const { refreshAnalytics } = useDashboardStore();
  const { role } = useUserStore();

  useEffect(() => {
    // Only admins have access to admin analytics endpoint
    if (role === "ADMIN") {
      refreshAnalytics();
    }
  }, [refreshAnalytics, role]);

  return null; // This component doesn't render anything
}
