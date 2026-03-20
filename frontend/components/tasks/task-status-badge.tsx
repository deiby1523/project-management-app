"use client"

import type { TaskStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: "To Do",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  DONE: {
    label: "Done",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
