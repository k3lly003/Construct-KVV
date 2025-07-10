/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bell,
  Search,
  User,
  Store,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNotificationStore } from '@/store/notificationStore';

interface NotificationItem {
  id: string;
  type: 'seller_request' | 'shop_approval' | 'system' | 'order' | string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  timeAgo: string;
  isUnread: boolean;
  data?: {
    userId?: string;
    userName?: string;
    userEmail?: string;
    shopId?: string;
    shopName?: string;
    requestDetails?: string;
    [key: string]: any;
  };
}

const Page = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  // Use the notification store
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    clearError,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Map backend notifications to NotificationItem type for UI
  const mapType = (type: string): NotificationItem['type'] => {
    switch (type) {
      case 'INFO':
      case 'SUCCESS':
      case 'WARNING':
      case 'ERROR':
        return 'system';
      default:
        return 'system';
    }
  };

  const mappedNotifications: NotificationItem[] = notifications.map((n) => ({
    id: n.id,
    type: mapType(n.type),
    icon: null, // Will be set by getNotificationIcon
    title: n.title || '',
    description: n.message || '',
    timeAgo: n.createdAt || '',
    isUnread: !n.isRead,
    data: n.metadata ? n.metadata : {},
  }));

  const filteredNotifications = mappedNotifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'seller_requests') return notification.type === 'seller_request';
    if (activeTab === 'shop_approvals') return notification.type === 'shop_approval';
    if (activeTab === 'system') return notification.type === 'system';
    if (activeTab === 'orders') return notification.type === 'order';
    return true;
  }).filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.description && notification.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const unreadCount = getUnreadCount();
  const sellerRequestCount = mappedNotifications.filter(n => n.type === 'seller_request' && n.isUnread).length;
  const shopApprovalCount = mappedNotifications.filter(n => n.type === 'shop_approval' && n.isUnread).length;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "border-gray-200 bg-white";
    switch (type) {
      case "SUCCESS":
        return "border-green-200 bg-green-50";
      case "WARNING":
        return "border-yellow-200 bg-yellow-50";
      case "ERROR":
        return "border-red-200 bg-red-50";
      default:
        return "border-amber-200 bg-amber-50";
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleApproveRequest = async (notification: NotificationItem) => {
    try {
      if (notification.type === 'seller_request') {
        // TODO: Implement API call to approve seller request
        console.log('Approving seller request for:', notification.data?.userName);
      } else if (notification.type === 'shop_approval') {
        // TODO: Implement API call to approve shop creation
        console.log('Approving shop creation for:', notification.data?.shopName);
      }
      
      // Mark notification as read after approval
      await handleMarkAsRead(notification.id);
      
      // Remove notification from list after approval
      // setNotifications(prev => prev.filter(n => n.id !== notification.id));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (notification: NotificationItem) => {
    try {
      if (notification.type === 'seller_request') {
        // TODO: Implement API call to reject seller request
        console.log('Rejecting seller request for:', notification.data?.userName);
      } else if (notification.type === 'shop_approval') {
        // TODO: Implement API call to reject shop creation
        console.log('Rejecting shop creation for:', notification.data?.shopName);
      }
      
      // Mark notification as read after rejection
      await handleMarkAsRead(notification.id);
      
      // Remove notification from list after rejection
      // setNotifications(prev => prev.filter(n => n.id !== notification.id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleViewDetails = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (notification.isUnread) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // TODO: Implement API call to delete notification
      // await fetch(`/api/v1/notification/${notificationId}`, { method: 'DELETE' });
      
      // setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'seller_request':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'shop_approval':
        return <Store className="w-4 h-4 text-green-600" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'order':
        return <Bell className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'seller_request':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Seller Request</Badge>;
      case 'shop_approval':
        return <Badge className="bg-green-100 text-green-800 text-xs">Shop Approval</Badge>;
      case 'system':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">System</Badge>;
      case 'order':
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Order</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Other</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold flex items-center">
            <Bell className="mr-2 h-5 w-5" /> Notifications
          </h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search notifications..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <GenericButton 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </GenericButton>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="seller_requests">
            Seller Requests
            {sellerRequestCount > 0 && (
              <Badge className="ml-2 bg-blue-500 text-white text-xs">
                {sellerRequestCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shop_approvals">
            Shop Approvals
            {shopApprovalCount > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs">
                {shopApprovalCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2">
          <ScrollArea className="h-[700px] w-full rounded-md border">
            <div className="p-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`mb-3 cursor-pointer transition-all hover:shadow-md ${
                    notification.isUnread ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleViewDetails(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-100">
                            {getNotificationIcon(notification.type)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            {getNotificationBadge(notification.type)}
                          </div>
                          <div className="flex items-center space-x-1">
                            {notification.isUnread && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{notification.timeAgo}</span>
                          </div>
                        </div>
                        {notification.description && (
                          <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                        )}
                        {(notification.type === 'seller_request' || notification.type === 'shop_approval') && (
                          <div className="flex items-center space-x-2">
                            <GenericButton
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveRequest(notification);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </GenericButton>
                            <GenericButton
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectRequest(notification);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </GenericButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="py-6 text-center text-sm text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Notification Details */}
        <div className="lg:col-span-1">
          {selectedNotification ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Notification Details</h3>
                  <GenericButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteNotification(selectedNotification.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </GenericButton>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gray-100">
                        {getNotificationIcon(selectedNotification.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{selectedNotification.title}</h4>
                      {getNotificationBadge(selectedNotification.type)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">{selectedNotification.description}</p>
                    <p className="text-xs text-gray-500">{selectedNotification.timeAgo}</p>
                  </div>

                  {selectedNotification.data && (
                    <div className="space-y-3 pt-4 border-t">
                      {selectedNotification.data.userName && (
                        <div>
                          <p className="text-sm font-medium">User Name</p>
                          <p className="text-sm text-gray-600">{selectedNotification.data.userName}</p>
                        </div>
                      )}
                      {selectedNotification.data.userEmail && (
                        <div>
                          <p className="text-sm font-medium">User Email</p>
                          <p className="text-sm text-gray-600">{selectedNotification.data.userEmail}</p>
                        </div>
                      )}
                      {selectedNotification.data.shopName && (
                        <div>
                          <p className="text-sm font-medium">Shop Name</p>
                          <p className="text-sm text-gray-600">{selectedNotification.data.shopName}</p>
                        </div>
                      )}
                      {selectedNotification.data.requestDetails && (
                        <div>
                          <p className="text-sm font-medium">Request Details</p>
                          <p className="text-sm text-gray-600">{selectedNotification.data.requestDetails}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedNotification.type === 'seller_request' || selectedNotification.type === 'shop_approval') && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-3">Actions</p>
                      <div className="flex space-x-2">
                        <GenericButton
                          onClick={() => handleApproveRequest(selectedNotification)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </GenericButton>
                        <GenericButton
                          variant="outline"
                          onClick={() => handleRejectRequest(selectedNotification)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </GenericButton>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Select a notification to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
