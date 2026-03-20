"use client"

import Link from "next/link"
import type { Task } from "@/lib/types"
import { TaskStatusBadge } from "./task-status-badge"
import { User } from "lucide-react"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{task.title}</h4>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}
        </div>
        <TaskStatusBadge status={task.status} />
      </div>
      {task.assignedUserId && (
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Assigned</span>
        </div>
      )}
    </Link>
  )
}
