"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { projectsApi, tasksApi } from "@/lib/api";
import type { Project, User } from "@/lib/types";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { AddMemberDialog } from "@/components/projects/add-member-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = parseInt(id);
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  const isOwner = user && project && user.id === project.creatorId;

  const fetchProject = useCallback(async () => {
    try {
      const projectData = await projectsApi.getById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      toast.error("Project not found");
      router.push("/projects");
    }
  }, [projectId, router]);

  const fetchMembers = useCallback(async () => {
    try {
      const membersData = await projectsApi.getMembers(projectId);
      setMembers(membersData);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  }, [projectId]);

  useEffect(() => {
    Promise.all([fetchProject(), fetchMembers()]).finally(() =>
      setIsLoading(false)
    );
  }, [fetchProject, fetchMembers]);

  const handleDeleteTask = async (taskId: number) => {
    try {
      await tasksApi.deleteTask(taskId);
      toast.success("Task deleted");
      setTaskRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await projectsApi.removeMember(projectId, userId);
      toast.success("Member removed");
      fetchMembers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove member"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/projects")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h2>
          <p className="text-muted-foreground">
            {project.description || "No description"}
          </p>
        </div>
        <CreateTaskDialog
          projectId={projectId}
          onTaskCreated={() => setTaskRefreshKey((k) => k + 1)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>All tasks in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                projectId={projectId}
                refreshKey={taskRefreshKey}
                onDeleteTask={handleDeleteTask}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>People in this project</CardDescription>
                </div>
                {isOwner && (
                  <AddMemberDialog
                    projectId={projectId}
                    existingMemberIds={members.map((m) => m.id)}
                    onMemberAdded={fetchMembers}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No members added yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      {isOwner && member.id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isOwner && members.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">
                    As the project owner, you can add or remove members.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
