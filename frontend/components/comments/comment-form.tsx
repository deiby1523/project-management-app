"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { commentsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Send } from "lucide-react"
import { toast } from "sonner"

interface CommentFormProps {
  taskId: number
  onCommentAdded: () => void
}

export function CommentForm({ taskId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setIsLoading(true)
    try {
      await commentsApi.create({
        content: content.trim(),
        taskId,
        userId: user.id,
      })
      setContent("")
      onCommentAdded()
      toast.success("Comment added")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        disabled={isLoading}
        className="flex-1 resize-none"
      />
      <Button type="submit" size="icon" disabled={isLoading || !content.trim()}>
        {isLoading ? <Spinner /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  )
}
