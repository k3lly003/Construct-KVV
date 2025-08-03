import { create } from "zustand";
import { persist } from "zustand/middleware";

// Dashboard-specific types based on actual API response
export interface RecentOrder {
  id: string;
  customerName: string;
  createdAt: string;
  total: number;
  status: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  avatar?: string;
  purchases: number;
  amount: number;
}

export interface AnalyticsData {
  // Direct properties from API response
  recentOrders?: RecentOrder[];
  topCustomers?: TopCustomer[];
  
  // Nested objects from API response
  users?: {
    totalCustomers?: number;
    totalUsers?: number;
  };
  
  ecommerce?: {
    totalSales?: number;
    totalOrders?: number;
    revenueByMonth?: Array<{ month: string; revenue: number }>;
  };
  
  bidding?: {
    projectsByStatus?: Array<{ status: string; _count: { _all: number } }>;
  };
  
  products?: {
    total?: number;
  };
  
  shops?: {
    total?: number;
  };
  
  categories?: {
    total?: number;
  };
}

export interface DashboardStats {
  totalCustomers: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalShops: number;
  totalCategories: number;
  totalUsers: number;
}

interface DashboardState {
  // Analytics data
  analytics: AnalyticsData | null;
  isAnalyticsLoading: boolean;
  analyticsError: string | null;

  // Dashboard view preferences
  selectedTimeRange: "7d" | "30d" | "90d" | "1y";
  dashboardView: "overview" | "detailed";
  
  // Search and filters
  searchTerm: string;
  selectedCategory: string | null;
  
  // UI state
  isRefreshing: boolean;
  lastUpdated: Date | null;

  // Actions
  setAnalytics: (analytics: AnalyticsData) => void;
  setAnalyticsLoading: (loading: boolean) => void;
  setAnalyticsError: (error: string | null) => void;
  setSelectedTimeRange: (range: "7d" | "30d" | "90d" | "1y") => void;
  setDashboardView: (view: "overview" | "detailed") => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  refreshAnalytics: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Initial state
      analytics: null,
      isAnalyticsLoading: false,
      analyticsError: null,
      selectedTimeRange: "30d",
      dashboardView: "overview",
      searchTerm: "",
      selectedCategory: null,
      isRefreshing: false,
      lastUpdated: null,

      // Actions
      setAnalytics: (analytics) => {
        set({ 
          analytics, 
          lastUpdated: new Date(),
          analyticsError: null 
        });
      },

      setAnalyticsLoading: (loading) => {
        set({ isAnalyticsLoading: loading });
      },

      setAnalyticsError: (error) => {
        set({ analyticsError: error, isAnalyticsLoading: false });
      },

      setSelectedTimeRange: (range) => {
        set({ selectedTimeRange: range });
        // Trigger analytics refresh when time range changes
        get().refreshAnalytics();
      },

      setDashboardView: (view) => {
        set({ dashboardView: view });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      setIsRefreshing: (refreshing) => {
        set({ isRefreshing: refreshing });
      },

      refreshAnalytics: async () => {
        const { setAnalyticsLoading, setAnalyticsError, setAnalytics } = get();
        
        try {
          setAnalyticsLoading(true);
          setAnalyticsError(null);
          
          // Import analytics service dynamically to avoid circular dependencies
          const { analyticsService } = await import("@/app/services/analyticsService");
          const token = localStorage.getItem("authToken");
          
          if (!token) {
            throw new Error("Authentication token not found");
          }

          const analyticsData = await analyticsService.getAdminAnalytics(token);
          setAnalytics(analyticsData as AnalyticsData);
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Failed to fetch analytics data";
          setAnalyticsError(errorMessage);
        } finally {
          setAnalyticsLoading(false);
        }
      },

      clearError: () => {
        set({ analyticsError: null });
      },
    }),
    {
      name: "dashboard-store",
      partialize: (state) => ({
        selectedTimeRange: state.selectedTimeRange,
        dashboardView: state.dashboardView,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);