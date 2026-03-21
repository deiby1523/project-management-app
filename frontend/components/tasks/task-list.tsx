"use client";

import { useEffect, useState } from "react";
import { tasksApi } from "@/lib/api";
import type { Task } from "@/lib/types";
import { TaskCard } from "./task-card";
import { Empty } from "@/components/ui/empty";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TaskListProps {
  projectId: number;
  refreshKey?: number;
  onDeleteTask?: (taskId: number) => void;
}

export function TaskList({
  projectId,
  refreshKey = 0,
  onDeleteTask,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    tasksApi
      .getByProject(projectId)
      .then(setTasks)
      .catch((error) => console.error("Failed to fetch tasks:", error))
      .finally(() => setIsLoading(false));
  }, [projectId, refreshKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        icon={CheckSquare}
        title="No tasks yet"
        description="Create a task to get started."
      />
    );
  }

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <div className="space-y-6">
      {todoTasks.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">
            To Do ({todoTasks.length})
          </h4>
          <div className="space-y-2">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <TaskCard task={task} />
                </div>
                {onDeleteTask && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {inProgressTasks.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">
            In Progress ({inProgressTasks.length})
          </h4>
          <div className="space-y-2">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <TaskCard task={task} />
                </div>
                {onDeleteTask && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {doneTasks.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">
            Done ({doneTasks.length})
          </h4>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <TaskCard task={task} />
                </div>
                {onDeleteTask && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
