"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "./dashboardStore";

export function DashboardStoreInitializer() {
  const { refreshAnalytics } = useDashboardStore();

  useEffect(() => {
    // Initialize dashboard data when the component mounts
    refreshAnalytics();
  }, [refreshAnalytics]);

  return null; // This component doesn't render anything
}