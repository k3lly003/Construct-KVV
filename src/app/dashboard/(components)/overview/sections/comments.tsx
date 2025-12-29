import { Heart, MessageCircle, Share, MoreHorizontal, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface CommentItem {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface CommentsProps {
  comments?: CommentItem[]
}

const defaultComments: CommentItem[] = [
  {
    id: "1",
    user: {
      name: "Annette Black",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Grey vintage 3D computer",
    timestamp: "4m",
    likes: 12,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "Darlene Robertson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Grey vintage 3D computer",
    timestamp: "8m",
    likes: 8,
    isLiked: true,
  },
  {
    id: "3",
    user: {
      name: "Marvin McKinney",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "How can I buy this design?",
    timestamp: "12m",
    likes: 5,
    isLiked: false,
  },
]

export default function Comments({ comments = defaultComments }: CommentsProps) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <h2 className="text-mid font-semibold text-gray-900">Comments</h2>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Image
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-small font-medium text-gray-900">{comment.user.name}</p>
                    <span className="text-small text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-small text-gray-600 mt-1">{comment.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-13">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-auto ${comment.isLiked ? "text-red-500" : "text-gray-500"}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                  <span className="text-small">{comment.likes}</span>
                </Button>

                <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-500">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50">
          View all
        </Button>
      </div>
    </Card>
  )
}
