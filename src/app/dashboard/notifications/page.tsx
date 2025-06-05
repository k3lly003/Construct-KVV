/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Search,
  User,
  Package,
  SlidersHorizontal,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  timeAgo: string;
  isUnread?: boolean;
}

const dummyNotifications: NotificationItem[] = [
  {
    id: '1',
    icon: <AvatarFallback className="bg-blue-500 text-white">WB</AvatarFallback>,
    title: 'Wrapped Bitcoin is now listen on Unity Exchange',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '24m ago',
    isUnread: true,
  },
  {
    id: '2',
    icon: <AvatarFallback className="bg-yellow-500 text-white">AB</AvatarFallback>,
    title: 'Airdrop BCHA - 0.25118470 Your airdrop for Nov 15, 2020.',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '24m ago',
  },
  {
    id: '3',
    icon: <AvatarFallback className="bg-blue-500 text-white">CT</AvatarFallback>,
    title: 'CyberVeinToken Is Now Available on Unity Exchange',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '21m ago',
    isUnread: true,
  },
  {
    id: '4',
    icon: <AvatarFallback className="bg-gray-300 text-gray-700">IS</AvatarFallback>,
    title: 'Inflation STR Amount 2.44273762',
    description: 'Your Stellar inflation reward for the week of Oct 1, 2019. Inflation STR - Oct 1st, 2019 07.05.16 -> HRZJSYA3563',
    timeAgo: '24m ago',
  },
  {
    id: '5',
    icon: <AvatarFallback className="bg-purple-500 text-white">UN</AvatarFallback>,
    title: 'Unification is Now Available on Unity Exchange',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '34m ago',
  },
  {
    id: '6',
    icon: <AvatarFallback className="bg-orange-500 text-white">IS</AvatarFallback>,
    title: 'Inflation STR Amount 2.44273762',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '54m ago',
    isUnread: true,
  },
  {
    id: '7',
    icon: <AvatarFallback className="bg-red-500 text-white">IB</AvatarFallback>,
    title: 'Inflation BTC Amount 0.14427376254676',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '44m ago',
  },
  {
    id: '8',
    icon: <AvatarFallback className="bg-blue-500 text-white">WB</AvatarFallback>,
    title: 'Wrapped Bitcoin is now listen on Unity Exchange',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcion (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    timeAgo: '24m ago',
  },
];

const page = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNotifications = dummyNotifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'account') return notification.title.toLowerCase().includes('airdrop'); // Example filter
    if (activeTab === 'goods') return notification.title.toLowerCase().includes('exchange'); // Example filter
    return true;
  }).filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.description && notification.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center">
          <Bell className="mr-2 h-5 w-5" /> Notifications
        </h1>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search notifications..."
            className="w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <GenericButton variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </GenericButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="goods">Goods</TabsTrigger>
        </TabsList>
        <Separator />
      </Tabs>

      <ScrollArea className="h-[700px] w-full rounded-md border">
        <div className="p-4">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="py-3">
              <div className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  {notification.icon}
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {notification.description && (
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{notification.timeAgo}</p>
                </div>
                {notification.isUnread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 self-start mt-1" />
                )}
              </div>
              <Separator className="my-3" />
            </div>
          ))}
          {filteredNotifications.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No notifications found.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default page;
