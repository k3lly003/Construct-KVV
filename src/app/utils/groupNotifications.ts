import { isToday, isYesterday, parseISO } from 'date-fns';
import { NotificationDTO } from '@/app/hooks/useNotifications';

export const groupNotificationsByDate = (notifications: NotificationDTO[]) => {
  const groups = {
    today: [] as NotificationDTO[],
    yesterday: [] as NotificationDTO[],
    older: [] as NotificationDTO[],
  };

  notifications.forEach((notification) => {
    const notificationDate = parseISO(notification.createdAt);
    if (isToday(notificationDate)) {
      groups.today.push(notification);
    } else if (isYesterday(notificationDate)) {
      groups.yesterday.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
}; 