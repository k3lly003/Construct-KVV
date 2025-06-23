"use client";

import React, { useState, useMemo } from 'react';
import { Bell, Check } from 'lucide-react';
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
const NotificationGroup = ({ title, notifications, onNotificationNavigate, onMarkAsRead }: any) => {
  if (notifications.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-500 pl-10">{title}</h3>
      <div className="space-y-2 pl-2 pr-2">
        {notifications.map((notif: NotificationDTO) => (
          <div
            key={notif.id}
            className={`p-2.5 rounded-lg border flex items-start justify-between transition-all duration-200 ${
              notif.isRead
                ? 'bg-white border-gray-200 hover:bg-gray-50'
                : 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100'
            }`}
          >
            <button
              className="flex-1 text-left focus:outline-none bg-transparent border-none"
              onClick={() => onNotificationNavigate(notif)}
              tabIndex={0}
              style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
              title={(() => {
                let meta: any = notif.metadata;
                if (!meta) meta = {};
                if (typeof meta === 'string') {
                  try { meta = JSON.parse(meta); } catch { meta = {}; }
                }
                if (meta.projectId && meta.bidId) return 'Click to view negotiation details';
                if (meta.projectId) return 'Click to view project bids';
                if (meta.bidId) return 'Click to view negotiation';
                return 'Click to view more details';
              })()}
            >
              <div className="flex justify-between items-center">
                <p className={`font-bold text-sm ${!notif.isRead ? 'text-black' : 'text-gray-700'}`}>{notif.title}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{format(new Date(notif.createdAt), 'p')}</span>
                  {!notif.isRead && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
                </div>
              </div>
              <p className={`text-xs mt-1 ${!notif.isRead ? 'text-yellow-900' : 'text-gray-500'}`}>{notif.message}</p>
            </button>
            <button
              className={`ml-2 p-1 rounded hover:bg-gray-200 ${notif.isRead ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={e => { e.stopPropagation(); onMarkAsRead(notif); }}
              disabled={notif.isRead}
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NotificationsBell = () => {
  const { notifications, unreadCount, markOneAsRead } = useNotificationStore();
  const router = useRouter();
  
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(notifications);
  }, [notifications]);

  // Only navigates, does NOT mark as read
  const handleNotificationNavigate = (notification: NotificationDTO) => {
    let meta: any = notification.metadata;
    if (!meta) meta = {};
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta);
      } catch (e) {
        console.warn('Failed to parse notification metadata:', meta);
        meta = {};
      }
    }
    console.log('Notification navigation metadata:', meta);
    if (meta.projectId && meta.bidId) {
      router.push(`/negotiation/${meta.bidId}`);
    } else if (meta.projectId) {
      router.push(`/my-projects/${meta.projectId}/bids`);
    } else if (meta.bidId) {
      router.push(`/negotiation/${meta.bidId}`);
    }
  };

  // Only marks as read, does NOT navigate
  const handleMarkAsRead = async (notification: NotificationDTO) => {
    if (!notification.isRead) {
      markOneAsRead(notification.id);
      await markNotificationAsRead(notification.id);
    }
  };

  return (
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
                onNotificationNavigate={handleNotificationNavigate}
                onMarkAsRead={handleMarkAsRead}
              />
              <NotificationGroup 
                title="Yesterday" 
                notifications={groupedNotifications.yesterday}
                onNotificationNavigate={handleNotificationNavigate}
                onMarkAsRead={handleMarkAsRead}
              />
              <NotificationGroup 
                title="Older" 
                notifications={groupedNotifications.older}
                onNotificationNavigate={handleNotificationNavigate}
                onMarkAsRead={handleMarkAsRead}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}; 