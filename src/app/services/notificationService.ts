import axios from 'axios';
import { NotificationDTO } from '../hooks/useNotifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchNotifications = async (): Promise<NotificationDTO[]> => {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    try {
      const response = await axios.get(`${API_URL}/api/v1/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // --- DEBUGGING: Log raw API response ---
      console.log("Raw API response for notifications:", response.data);
      
      // The backend returns { notifications: [...], pagination: {...} }
      const data = response.data.data;
      if (data && Array.isArray(data.notifications)) {
        return data.notifications;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  };

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  try {
    // We assume a PATCH request to this endpoint marks it as read
    await axios.patch(`${API_URL}/api/v1/notification/${notificationId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};