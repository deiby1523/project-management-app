"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { coursesApi, projectsApi } from "@/lib/api";
import type { Course, Project, User } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen, Hash, Users, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

type ProjectWithMembers = Project & {
  members: User[];
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [projects, setProjects] = useState<ProjectWithMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseData, projectList, myCourses] = await Promise.all([
          coursesApi.getById(courseId),
          projectsApi.getByCourse(courseId),
          coursesApi.getMyCourses(),
        ]);

        setCourse(courseData);
        setIsEnrolled(myCourses.some((c) => c.id === courseId));

        const projectsWithMembers = await Promise.all(
          projectList.map(async (project) => {
            const members = await projectsApi.getMembers(project.id);
            return { ...project, members };
          })
        );

        setProjects(projectsWithMembers);
      } catch (error) {
        console.error("Failed to fetch course detail:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handleToggleEnrollment = async () => {
    if (!user || !course) return;
    setIsToggling(true);
    try {
      if (isEnrolled) {
        await coursesApi.removeUser(course.id, user.id);
        setIsEnrolled(false);
        toast.success(`Left "${course.name}"`);
      } else {
        await coursesApi.addUser(course.id, user.id);
        setIsEnrolled(true);
        toast.success(`Joined "${course.name}"`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Course not found.</p>
        <Button variant="ghost" size="icon" onClick={() => router.push("/courses")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/courses")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight">{course.name}</h2>
          <p className="text-muted-foreground">
            {course.description || "No description available."}
          </p>
        </div>

        {/* Badge + Toggle */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isEnrolled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isEnrolled ? "Registered" : "Not Registered"}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={isToggling}
            onClick={handleToggleEnrollment}
            className={`gap-1.5 text-xs ${
              isEnrolled
                ? "text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                : "text-green-600 hover:text-green-700 border-green-300 hover:bg-green-50"
            }`}
          >
            {isToggling ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isEnrolled ? (
              <LogOut className="h-3.5 w-3.5" />
            ) : (
              <LogIn className="h-3.5 w-3.5" />
            )}
            {isEnrolled ? "Leave" : "Join"}
          </Button>
        </div>
      </div>

      {/* Course info */}
      <div className="rounded-lg border p-4 my-2">
        <p className="text-sm text-muted-foreground">ID</p>
        <div className="mt-1 flex items-center gap-2 font-medium">
          <Hash className="h-4 w-4" />
          {course.id}
        </div>
      </div>

      <div className="rounded-lg border p-4 my-2">
        <p className="text-sm text-muted-foreground">Name</p>
        <p className="mt-1 font-medium">{course.name}</p>
      </div>

      <div className="rounded-lg border p-4 my-2 mb-10">
        <p className="text-sm text-muted-foreground">Description</p>
        <p className="mt-1">{course.description || "No description available."}</p>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Projects of this Course</h3>
          <p className="text-muted-foreground text-sm">
            All projects associated with this course.
          </p>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No projects registered for this course.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    {project.description || "No description available."}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Members ({project.members.length})
                    </p>
                  </div>

                  {project.members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members assigned.</p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {project.members.slice(0, 8).map((member) => (
                        <div key={member.id} className="rounded-md border px-3 py-2">
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {member.email}
                          </p>
                        </div>
                      ))}

                      {project.members.length > 8 && (
                        <div className="rounded-md border px-3 py-2 flex items-center justify-center text-sm text-muted-foreground">
                          ...
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}