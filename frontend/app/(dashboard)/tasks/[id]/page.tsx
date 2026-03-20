"use client"

import { useEffect, useState, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { tasksApi, projectsApi, usersApi } from "@/lib/api"
import type { Task, Project, User, TaskStatus } from "@/lib/types"
import { TaskStatusBadge } from "@/components/tasks/task-status-badge"
import { CommentList } from "@/components/comments/comment-list"
import { CommentForm } from "@/components/comments/comment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FolderOpen } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
]

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const taskId = parseInt(id)
  const router = useRouter()
  const { user } = useAuth()
  const [task, setTask] = useState<Task | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [projectMembers, setProjectMembers] = useState<User[]>([])
  const [assignedUser, setAssignedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)

  const fetchTask = useCallback(async () => {
    try {
      const taskData = await tasksApi.getById(taskId)
      setTask(taskData)

      // Fetch project info
      const projectData = await projectsApi.getById(taskData.projectId)
      setProject(projectData)

      // Fetch project members for assignment
      const members = await projectsApi.getMembers(taskData.projectId)
      setProjectMembers(members)

      // Fetch assigned user info if exists
      if (taskData.assignedUserId) {
        const userData = await usersApi.getById(taskData.assignedUserId)
        setAssignedUser(userData)
      }
    } catch (error) {
      console.error("Failed to fetch task:", error)
      toast.error("Task not found")
      router.push("/projects")
    }
  }, [taskId, router])

  useEffect(() => {
    fetchTask().finally(() => setIsLoading(false))
  }, [fetchTask])

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return

    try {
      const updatedTask = await tasksApi.updateStatus(task.id, status)
      setTask(updatedTask)
      toast.success("Status updated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  const handleAssignUser = async (userId: string) => {
    if (!task) return

    try {
      const updatedTask = await tasksApi.assign(task.id, { assignedUserId: parseInt(userId) })
      setTask(updatedTask)
      const userData = await usersApi.getById(parseInt(userId))
      setAssignedUser(userData)
      toast.success("Task assigned")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign task")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!task || !project) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${project.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <Link href={`/projects/${project.id}`} className="hover:underline">
              {project.name}
            </Link>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{task.title}</h2>
        </div>
        <TaskStatusBadge status={task.status} className="text-sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {task.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Discussion about this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CommentList taskId={taskId} refreshKey={commentRefreshKey} />
              <Separator />
              <CommentForm
                taskId={taskId}
                onCommentAdded={() => setCommentRefreshKey((k) => k + 1)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Update the task status</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={task.status} onValueChange={(value) => handleStatusChange(value as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignee</CardTitle>
              <CardDescription>Who is working on this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedUser && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {assignedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{assignedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{assignedUser.email}</p>
                  </div>
                </div>
              )}
              {projectMembers.length > 0 && (
                <Select
                  value={task.assignedUserId?.toString() || ""}
                  onValueChange={handleAssignUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projectMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {projectMembers.length === 0 && !assignedUser && (
                <p className="text-sm text-muted-foreground">
                  Add members to the project to assign tasks.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
