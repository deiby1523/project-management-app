"use client"

import { useEffect, useState } from "react"
import { commentsApi, usersApi } from "@/lib/api"
import type { Comment, User } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Empty } from "@/components/ui/empty"
import { MessageSquare } from "lucide-react"

interface CommentWithUser extends Comment {
  user?: User
}

interface CommentListProps {
  taskId: number
  refreshKey?: number
}

export function CommentList({ taskId, refreshKey = 0 }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    commentsApi
      .getByTask(taskId)
      .then(async (commentsData) => {
        // Fetch user info for each comment
        const commentsWithUsers = await Promise.all(
          commentsData.map(async (comment) => {
            try {
              const user = await usersApi.getById(comment.userId)
              return { ...comment, user }
            } catch {
              return comment
            }
          })
        )
        setComments(commentsWithUsers)
      })
      .catch((error) => console.error("Failed to fetch comments:", error))
      .finally(() => setIsLoading(false))
  }, [taskId, refreshKey])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <Empty
        icon={MessageSquare}
        title="No comments yet"
        description="Be the first to comment on this task."
        className="py-6"
      />
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              {comment.user?.name
                ? comment.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{comment.user?.name || "Unknown User"}</span>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
