import axios from "axios";
import { Notification } from "@/components/ui/notification-modal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

      return response.data as NotificationResponse;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error fetching notifications:", error);
      throw new Error(
        err.response?.data?.message || "Failed to fetch notifications"
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

      return response.data as MarkAsReadResponse;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error marking notification as read:", error);
      throw new Error(
        err.response?.data?.message || "Failed to mark notification as read"
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

      return response.data as MarkAsReadResponse;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error marking all as read:", error);
      throw new Error(
        err.response?.data?.message || "Failed to mark all as read"
      );
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getAllNotifications(1, 100); // Get all to count unread
      return response.data.notifications.filter(
        (notification) => !notification.isRead
      ).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  async deleteNotification(notificationId: string): Promise<MarkAsReadResponse> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/notification/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data as MarkAsReadResponse;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error deleting notification:", error);
      throw new Error(
        err.response?.data?.message || "Failed to delete notification"
      );
    }
  }

  async deleteAllNotifications(): Promise<MarkAsReadResponse> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/notification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data as MarkAsReadResponse;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error deleting all notifications:", error);
      throw new Error(
        err.response?.data?.message || "Failed to delete all notifications"
      );
    }
  }
}

export const notificationService = new NotificationService();
