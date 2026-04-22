"use client";

import { useEffect, useState } from "react";
import { tasksApi } from "@/lib/api";
import type { Task } from "@/lib/types";
import { TaskCard } from "./task-card";
import { Empty } from "@/components/ui/empty";
import { CheckSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  // Estado para controlar qué tarea se pretende eliminar
  const [taskConfirmId, setTaskConfirmId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    tasksApi
      .getByProject(projectId)
      .then(setTasks)
      .catch((error) => console.error("Failed to fetch tasks:", error))
      .finally(() => setIsLoading(false));
  }, [projectId, refreshKey]);

  const confirmDeletion = () => {
    if (taskConfirmId !== null && onDeleteTask) {
      onDeleteTask(taskConfirmId);
      setTaskConfirmId(null);
    }
  };

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

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  // Función auxiliar para renderizar la lista y evitar repetición de código
  const renderTaskGroup = (title: string, groupTasks: Task[]) => (
    groupTasks.length > 0 && (
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          {title} ({groupTasks.length})
        </h4>
        <div className="space-y-2">
          {groupTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <TaskCard task={task} />
              </div>
              {onDeleteTask && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setTaskConfirmId(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      {renderTaskGroup("To Do", todoTasks)}
      {renderTaskGroup("In Progress", inProgressTasks)}
      {renderTaskGroup("Done", doneTasks)}

      {/* Modal de confirmación único para el componente */}
      <AlertDialog 
        open={taskConfirmId !== null} 
        onOpenChange={(open) => !open && setTaskConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la tarea permanentemente. No puedes deshacer este cambio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletion}
              className="bg-destructive hover:bg-destructive/80"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}