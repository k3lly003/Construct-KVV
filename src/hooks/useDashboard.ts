"use client";

import { useDashboardStore, useUserStore } from "../store";
import { useCallback, useMemo } from "react";

/**
 * Custom hook that provides dashboard-specific functionality
 * and computed values for dashboard components
 */
export function useDashboard() {
  const {
    analytics,
    isAnalyticsLoading,
    analyticsError,
    searchTerm,
    selectedCategory,
    selectedTimeRange,
    dashboardView,
    isRefreshing,
    lastUpdated,
    setSearchTerm,
    setSelectedCategory,
    setSelectedTimeRange,
    setDashboardView,
    refreshAnalytics,
    clearError,
  } = useDashboardStore();

  const { role, firstName, lastName, email } = useUserStore();

  // Computed values
  const stats = useMemo(() => {
    if (!analytics) return null;
    
    return {
      totalCustomers: analytics.users?.totalCustomers || 0,
      totalRevenue: analytics.ecommerce?.totalSales || 0,
      totalOrders: analytics.ecommerce?.totalOrders || 0,
      totalProducts: analytics.products?.total || 0,
      totalShops: analytics.shops?.total || 0,
      totalCategories: analytics.categories?.total || 0,
      totalUsers: analytics.users?.totalUsers || 0,
    };
  }, [analytics]);

  const recentOrders = useMemo(() => {
    return analytics?.recentOrders || [];
  }, [analytics]);

  const topCustomers = useMemo(() => {
    return analytics?.topCustomers || [];
  }, [analytics]);

  const revenueData = useMemo(() => {
    return analytics?.ecommerce?.revenueByMonth || [];
  }, [analytics]);

  const projectsData = useMemo(() => {
    return analytics?.bidding?.projectsByStatus || [];
  }, [analytics]);

  // User info
  const userInfo = useMemo(() => ({
    fullName: `${firstName || ""} ${lastName || ""}`.trim(),
    firstName,
    lastName,
    email,
    role,
  }), [firstName, lastName, email, role]);

  // Actions
  const handleRefresh = useCallback(async () => {
    await refreshAnalytics();
  }, [refreshAnalytics]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  const handleCategoryFilter = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, [setSelectedCategory]);

  const handleTimeRangeChange = useCallback((range: "7d" | "30d" | "90d" | "1y") => {
    setSelectedTimeRange(range);
  }, [setSelectedTimeRange]);

  const handleViewChange = useCallback((view: "overview" | "detailed") => {
    setDashboardView(view);
  }, [setDashboardView]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Loading states
  const isLoading = isAnalyticsLoading || isRefreshing;
  const hasError = !!analyticsError;
  const hasData = !!analytics;

  return {
    // Data
    analytics,
    stats,
    recentOrders,
    topCustomers,
    revenueData,
    projectsData,
    userInfo,
    
    // UI State
    searchTerm,
    selectedCategory,
    selectedTimeRange,
    dashboardView,
    lastUpdated,
    
    // Loading states
    isLoading,
    hasError,
    hasData,
    error: analyticsError,
    
    // Actions
    handleRefresh,
    handleSearch,
    handleCategoryFilter,
    handleTimeRangeChange,
    handleViewChange,
    handleClearError,
  };
}