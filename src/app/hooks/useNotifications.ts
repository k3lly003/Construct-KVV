import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNotificationStore } from '@/store/notificationStore';
import { fetchNotifications } from '../services/notificationService';
import { useRouter } from 'next/navigation';

// Define the shape of a notification
export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: 'NEW_PROJECT' | 'NEW_BID' | 'BID_ACCEPTED' | 'BID_REJECTED' | 'INFO';
  isRead: boolean;
  createdAt: string; // ISO 8601 date string
  metadata?: {
    projectId?: string;
    bidId?: string;
  };
}

export const useNotifications = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { addNotification, setNotifications } = useNotificationStore();
  const router = useRouter();

  const { data: initialNotifications } = useQuery<NotificationDTO[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications, setNotifications]);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification: NotificationDTO) => {
        console.log('New notification received:', notification);
        addNotification(notification);
        
        // Show a toast notification
        toast.info(notification.message, {
          action: {
            label: 'View',
            onClick: () => {
              const meta = notification.metadata || {};
              if (meta.projectId && meta.bidId) {
                router.push(`/negotiation/${meta.bidId}`);
              } else if (meta.projectId) {
                router.push(`/my-projects/${meta.projectId}/bids`);
              } else if (meta.bidId) {
                router.push(`/negotiation/${meta.bidId}`);
              } else {
                console.warn('No navigation target found for notification:', notification);
              }
            },
          },
        });

        // Optionally, invalidate queries to refetch data
        if (notification.type === 'NEW_BID') {
          queryClient.invalidateQueries({
            queryKey: ['projectBids', notification.metadata?.projectId],
          });
        }
      };

      socket.on('newNotification', handleNewNotification);

      return () => {
        socket.off('newNotification', handleNewNotification);
      };
    }
  }, [socket, queryClient, addNotification, router]);
}; 