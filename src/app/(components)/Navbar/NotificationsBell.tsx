"use client";

import React, { useState, useMemo } from 'react';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useNotificationStore } from '@/store/notificationStore';
import { useRouter } from 'next/navigation';
import { markNotificationAsRead } from '@/app/services/notificationService';
import { NotificationDTO } from '@/app/hooks/useNotifications';
import { groupNotificationsByDate } from '@/app/utils/groupNotifications';

// A helper component for rendering a group of notifications
const NotificationGroup = ({ title, notifications, onNotificationClick }: any) => {
  if (notifications.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-500">{title}</h3>
      <div className="space-y-2">
        {notifications.map((notif: NotificationDTO) => (
          <div
            key={notif.id}
            className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              notif.isRead
                ? 'bg-white border-gray-200 hover:bg-gray-50'
                : 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100'
            }`}
            onClick={() => onNotificationClick(notif)}
          >
            <div className="flex justify-between items-center">
              <p className={`font-bold text-sm ${!notif.isRead ? 'text-black' : 'text-gray-700'}`}>
                {notif.title}
              </p>
              <div className="flex items-center space-x-2">
                 <span className="text-xs text-gray-400">
                    {format(new Date(notif.createdAt), 'p')}
                 </span>
                 {!notif.isRead && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
              </div>
            </div>
            <p className={`text-xs mt-1 ${!notif.isRead ? 'text-yellow-900' : 'text-gray-500'}`}>
              {notif.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NotificationsBell = () => {
  const { notifications, unreadCount, markOneAsRead } = useNotificationStore();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDTO | null>(null);

  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(notifications);
  }, [notifications]);

  const handleNotificationClick = async (notification: NotificationDTO) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    if (!notification.isRead) {
      markOneAsRead(notification.id);
      await markNotificationAsRead(notification.id);
    }
  };

  const handleModalActionClick = () => {
    if (!selectedNotification || !selectedNotification.metadata?.projectId) return;

    if (selectedNotification.title === 'New Bid Received') {
      router.push(`/projects/${selectedNotification.metadata.projectId}/bids`);
    }
    
    setIsModalOpen(false);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button className="relative p-2">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-[380px] sm:w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 pt-10">You have no new notifications.</p>
            ) : (
              <>
                <NotificationGroup 
                  title="Today" 
                  notifications={groupedNotifications.today} 
                  onNotificationClick={handleNotificationClick}
                />
                <NotificationGroup 
                  title="Yesterday" 
                  notifications={groupedNotifications.yesterday}
                  onNotificationClick={handleNotificationClick}
                />
                <NotificationGroup 
                  title="Older" 
                  notifications={groupedNotifications.older}
                  onNotificationClick={handleNotificationClick}
                />
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNotification.title}</DialogTitle>
                <DialogDescription className="pt-4 text-base text-gray-700">
                  {selectedNotification.message}
                </DialogDescription>
              </DialogHeader>
                  <DialogFooter className="mt-4 sm:justify-start">
      {selectedNotification.title === 'New Bid Received' && (
        <button 
          onClick={handleModalActionClick}
          className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
        >
          View Bids
        </button>
      )}
      <button 
        onClick={() => setIsModalOpen(false)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-transparent hover:bg-slate-100 h-10 px-4 py-2"
      >
        Close
      </button>
    </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 