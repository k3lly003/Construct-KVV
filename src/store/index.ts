// Centralized store exports for better organization
export { useUserStore, UserStoreInitializer } from "./userStore";
export { useCartStore, useCartHydration } from "./cartStore";
export { useGlobalStore } from "./globalStore";
export { useNotificationStore } from "./notificationStore";
export { useDashboardStore } from "./dashboardStore";
export { DashboardStoreInitializer } from "./dashboardStoreInitializer";

// Store types
export type { CartItem } from "./cartStore";
export type { 
  DashboardStats, 
  RecentOrder, 
  TopCustomer, 
  AnalyticsData
} from "./dashboardStore";