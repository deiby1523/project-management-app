"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { coursesApi } from "@/lib/api";
import type { Course } from "@/lib/types";
import { Empty } from "@/components/ui/empty";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { CreateCourseDialog } from "@/components/courses/create-course-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controlar la confirmación de eliminación
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Nota: He quitado Promise.try ya que no es estándar en JS nativo 
      // a menos que uses una librería específica; usualmente basta con await directo.
      const data = await coursesApi.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const executeDelete = async () => {
    if (courseToDelete === null) return;
    
    try {
      await coursesApi.deleteCourse(courseToDelete);
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete course"
      );
    } finally {
      setCourseToDelete(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage and organize your courses.
          </p>
        </div>
        <CreateCourseDialog onCourseCreated={fetchCourses} />
      </div>

      {courses.length === 0 ? (
        <Empty
          icon={FolderOpen}
          title="No courses yet"
          description="Create your course to get started."
        />
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Options</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-2 font-medium">{course.name}</td>
                  <td className="px-4 py-2">{course.description || "-"}</td>
                  <td className="px-4 py-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setCourseToDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => {
                        /* Tu lógica de edición aquí */
                        console.log("Edit course", course.id);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog 
        open={courseToDelete !== null} 
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. Se eliminarán todos los datos asociados a este curso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete}
              className="bg-destructive hover:bg-destructive/80"
            >
              Confirmar Eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}