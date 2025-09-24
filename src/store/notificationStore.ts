import { create } from "zustand";
import { Notification } from "@/components/ui/notification-modal";
import { notificationService } from "@/app/services/notificationService";

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getUnreadCount: () => number;
  clearError: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    // Check if user is authenticated
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      set({
        notifications: [],
        isLoading: false,
        error: "Authentication required",
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await notificationService.getAllNotifications();

      // Format the notifications with relative time
      const formattedNotifications = response.data.notifications.map(
        (notification) => ({
          ...notification,
          // The createdAt field is already a string, so we can use it directly
          // The modal will format it for display
        })
      );

      set({
        notifications: formattedNotifications,
        isLoading: false,
      });
    } catch (error) {
      const err = error as { message?: string };
      set({
        error: err.message || "Failed to fetch notifications",
        isLoading: false,
      });
      console.error("Error fetching notifications:", error);
    }
  },

  markAsRead: async (id: string) => {
    // Check if user is authenticated
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      set({ error: "Authentication required" });
      return;
    }

    try {
      await notificationService.markAsRead(id);

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        ),
      }));
    } catch (error) {
      const err = error as { message?: string };
      set({ error: err.message || "Failed to mark notification as read" });
      console.error("Error marking notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    // Check if user is authenticated
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      set({ error: "Authentication required" });
      return;
    }

    try {
      await notificationService.markAllAsRead();

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      }));
    } catch (error) {
      const err = error as { message?: string };
      set({
        error: err.message || "Failed to mark all notifications as read",
      });
      console.error("Error marking all notifications as read:", error);
    }
  },

  getUnreadCount: () => {
    // Check if user is authenticated
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      return 0;
    }

    return get().notifications.filter((notification) => !notification.isRead)
      .length;
  },

  clearError: () => {
    set({ error: null });
  },

  clearNotifications: () => {
    set({ notifications: [], error: null });
  },
}));
