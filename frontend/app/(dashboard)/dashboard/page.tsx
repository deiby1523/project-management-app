"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { projectsApi, tasksApi, coursesApi } from "@/lib/api";
import type { Project, Task, Course, ProjectStats } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  CheckSquare,
  Clock,
  ArrowRight,
  Target,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [collaborativeProjects, setCollaborativeProjects] = useState<Project[]>(
    []
  );
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const [owned, collab, courses, stats] = await Promise.all([
          projectsApi.getMyProjects(),
          projectsApi.getCollaborative(),
          coursesApi.getMyCourses(),
          projectsApi.getProjectStats(),
        ]);

        setMyProjects(owned);
        setCollaborativeProjects(collab);
        setMyCourses(courses);
        setProjectStats(stats);

        // Fetch tasks from first few projects
        const allProjects = [...owned, ...collab];
        if (allProjects.length > 0) {
          const tasksPromises = allProjects
            .slice(0, 3)
            .map((p) => tasksApi.getByProject(p.id));
          const tasksResults = await Promise.all(tasksPromises);
          const allTasks = tasksResults.flat().slice(0, 5);
          setRecentTasks(allTasks);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalProjects = myProjects.length + collaborativeProjects.length;
  const todoTasks = recentTasks.filter((t) => t.status === "TODO").length;
  const inProgressTasks = recentTasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;

  const PROJECT_GOAL = 52;
  const progressPercentage = Math.min(
    (totalProjects / PROJECT_GOAL) * 100,
    100
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name}
        </h2>
        <p className="text-muted-foreground">
          Here{"'"}s an overview of your projects and tasks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {myProjects.length} owned, {collaborativeProjects.length}{" "}
              collaborative
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects} / {PROJECT_GOAL}
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-lime-400 transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks waiting to start
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks currently active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>Projects you own</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No projects yet. Create one to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {myProjects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>
                  Latest tasks from your projects
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tasks yet. Create a project and add tasks!
              </p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{task.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          task.status === "DONE"
                            ? "bg-green-100 text-green-700"
                            : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Stats Section */}
      {projectStats && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Project Statistics</CardTitle>
              <CardDescription>
                Your project activity averages over time
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Per Week
                </p>
                <p className="text-2xl font-bold">
                  {projectStats.averagePerWeek.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  avg projects / week
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Per Month
                </p>
                <p className="text-2xl font-bold">
                  {projectStats.averagePerMonth.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  avg projects / month
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Per Semester
                </p>
                <p className="text-2xl font-bold">
                  {projectStats.averagePerSemester.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  avg projects / semester
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Per Year
                </p>
                <p className="text-2xl font-bold">
                  {projectStats.averagePerYear.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  avg projects / year
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/50 px-4 py-3 flex items-center gap-3">
              <Target className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                You have created a total of{" "}
                <span className="font-semibold text-foreground">
                  {projectStats.totalProjects}
                </span>{" "}
                projects across all your activity.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Courses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Courses you are enrolled in</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You are not enrolled in any courses yet.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.slice(0, 6).map((course) => (
                <Link
                  key={course.id}
                  href={""}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-default"
                >
                  <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{course.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
