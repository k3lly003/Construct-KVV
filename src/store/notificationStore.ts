import { create } from 'zustand';
import { NotificationDTO } from '@/app/hooks/useNotifications'; // Re-using the DTO from the hook

interface NotificationStore {
  notifications: NotificationDTO[];
  unreadCount: number;
  addNotification: (notification: NotificationDTO) => void;
  setNotifications: (notifications: NotificationDTO[]) => void;
  markAllAsRead: () => void;
  markOneAsRead: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ ...notification, isRead: false }, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  setNotifications: (notifications) => {
    // Ensure every notification has a definite boolean `isRead` status.
    const processedNotifications = notifications.map(n => ({ ...n, isRead: !!n.isRead }));
    const unreadCount = processedNotifications.filter(n => !n.isRead).length;
    
    return set({
      notifications: processedNotifications,
      unreadCount,
    });
  },
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  markOneAsRead: (notificationId: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
      // Decrement unread count only if it was actually unread before this action
      unreadCount: state.notifications.find(n => n.id === notificationId && !n.isRead) 
                   ? state.unreadCount - 1 
                   : state.unreadCount,
    })),
})); 