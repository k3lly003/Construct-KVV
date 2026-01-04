import { Bell, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface NotificationItem {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  type: "posting" | "computer" | "vintage" | "code"
}

interface NotificationsProps {
  notifications?: NotificationItem[]
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "1",
    user: {
      name: "Kristin Watson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "3D posting wallpapers...",
    timestamp: "2 min",
    type: "posting",
  },
  {
    id: "2",
    user: {
      name: "Leslie Alexander",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "3D computer wallpapers",
    timestamp: "5 min",
    type: "computer",
  },
  {
    id: "3",
    user: {
      name: "Annette Black",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Grey vintage 3D computer",
    timestamp: "12 min",
    type: "vintage",
  },
  {
    id: "4",
    user: {
      name: "Brooklyn Simmons",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Grey code wallpaper",
    timestamp: "15 min",
    type: "code",
  },
  {
    id: "5",
    user: {
      name: "Kristin Watson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "3D posting wallpapers...",
    timestamp: "20 min",
    type: "posting",
  },
]

export default function Notifications({ notifications = defaultNotifications }: NotificationsProps) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-mid font-semibold text-gray-900">Notifications</h2>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3">
              <Image
                src={notification.user.avatar || "/placeholder.svg"}
                alt={notification.user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-small font-medium text-gray-900 truncate">{notification.user.name}</p>
                    <p className="text-small text-gray-600 mt-0.5 line-clamp-2">{notification.content}</p>
                  </div>
                  <span className="text-small text-gray-500 ml-2 flex-shrink-0">{notification.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
          See all notifications
        </Button>
      </div>
    </Card>
  )
}
