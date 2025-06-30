"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, Database, FileIcon } from "lucide-react";
import { useState, useMemo } from "react";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  type: string;
  description: string;
  timestamp: string;
  date: Date;
  content?: string;
  attachments?: {
    name: string;
    size: string;
    type: 'design' | 'database' | 'document';
  }[];
  comment?: string;
  teamMembers?: string[];
}

const activityData: ActivityItem[] = [
  {
    id: "1",
    user: {
      name: "Jacqueline Steve",
      initials: "JS",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
    },
    type: "attribute_change",
    description: "We has changed 2 attributes on 05:16PM",
    timestamp: "05:16PM",
    date: new Date(),
    content: "In an awareness campaign, it is vital for people to begin put 2 and 2 together and begin to recognize your cause. Too much or too little spacing, as in the example below, can make things unpleasant for the reader. The goal is to make your text as comfortable to read as possible. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart."
  },
  {
    id: "2",
    user: {
      name: "Megan Elmore",
      initials: "ME"
    },
    type: "event_attachment",
    description: "Adding a new event with attachments - 04:45PM",
    timestamp: "04:45PM",
    date: new Date(),
    attachments: [
      {
        name: "Business Template - UI/UX design",
        size: "689 KB",
        type: "design"
      },
      {
        name: "Bank Management System - PSD",
        size: "8.78 MB",
        type: "database"
      }
    ]
  },
  {
    id: "3",
    user: {
      name: "User Erica245",
      initials: "E2",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
    },
    type: "ticket_received",
    description: "submitted a ticket - 02:33PM",
    timestamp: "02:33PM",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: "4",
    user: {
      name: "Nancy Martino",
      initials: "NM"
    },
    type: "comment",
    description: "Commented on 12:57PM",
    timestamp: "12:57PM",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    comment: "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your own style choices."
  },
  {
    id: "5",
    user: {
      name: "Lewis Arnold",
      initials: "LA",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
    },
    type: "project_creation",
    description: "Create new project building product - 10:05AM",
    timestamp: "10:05AM",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    content: "Every team project can have a velzon. Use the velzon to share information with your team to understand and contribute to your project.",
    teamMembers: ["2+"]
  }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'design':
      return <FileText className="w-4 h-4 text-orange-500" />;
    case 'database':
      return <Database className="w-4 h-4 text-blue-500" />;
    default:
      return <FileIcon className="w-4 h-4 text-gray-500" />;
  }
};

export default function ActivitySection() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const filters = ["Today", "Weekly", "Monthly"];

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return activityData.filter(item => {
      switch (activeFilter) {
        case "Today":
          return item.date >= today;
        case "Weekly":
          return item.date >= weekAgo;
        case "Monthly":
          return item.date >= monthAgo;
        default:
          return true;
      }
    });
  }, [activeFilter]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <div className="flex gap-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === filter
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Single Activity Card */}
      <Card className="border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-12 bottom-0 w-px bg-gray-200"></div>
            
            {/* Activity Items */}
            <div className="space-y-8">
              {filteredActivities.map((item) => (
                <div key={item.id} className="relative flex justify-center ml-1 gap-4">
                  {/* Avatar */}
                  <Avatar className="w-10 h-10 flex-shrink-0 -ml-1 border-2 border-white">
                    {item.user.avatar ? (
                      <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {item.user.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0 -mt-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold text-gray-900">{item.user.name}</h3>
                      {item.type === "ticket_received" && (
                        <Badge variant="outline" className="text-xs">
                          New ticket received
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>

                    {/* Content Text */}
                    {item.content && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    )}

                    {/* Attachments */}
                    {item.attachments && (
                      <div className="mt-3 space-y-2">
                        {item.attachments.map((attachment, attachmentIndex) => (
                          <div
                            key={attachmentIndex}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {getFileIcon(attachment.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment */}
                    {item.comment && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                        &quot;{item.comment}&quot;
                        </p>
                      </div>
                    )}

                    {/* Team Members */}
                    {item.teamMembers && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <Avatar className="w-6 h-6 border-2 border-white">
                            <AvatarImage src="https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2" />
                          </Avatar>
                          <Avatar className="w-6 h-6 border-2 border-white">
                            <AvatarImage src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2" />
                          </Avatar>
                          <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {item.teamMembers[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Show message when no activities match filter */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No activities found for the selected time period.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}