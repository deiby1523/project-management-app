"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { coursesApi, projectsApi } from "@/lib/api";
import type { Course } from "@/lib/types";
import { ProjectCard } from "@/components/projects/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty } from "@/components/ui/empty";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { CreateCourseDialog } from "@/components/courses/create-course-dialog";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const courses = await Promise.try(coursesApi.getCourses);
      setCourses(courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
                <th className="px-4 py-2 text-left">options</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-2 font-medium">{course.name}</td>
                  <td className="px-4 py-2">{course.description || "-"}</td>
                  <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {} }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-base"
                    onClick={() => {} }
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
    </div>
  );
}
