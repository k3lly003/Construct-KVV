import axios from "axios";
import { Notification } from "@/components/ui/notification-modal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

class NotificationService {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  async getAllNotifications(
    page: number = 1,
    limit: number = 10
  ): Promise<NotificationResponse> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/notification?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }

  async markAsRead(notificationId: string): Promise<MarkAsReadResponse> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/notification/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      throw new Error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }

  async markAllAsRead(): Promise<MarkAsReadResponse> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/notification/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getAllNotifications(1, 100); // Get all notifications to count unread
      return response.data.notifications.filter(
        (notification) => !notification.isRead
      ).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
