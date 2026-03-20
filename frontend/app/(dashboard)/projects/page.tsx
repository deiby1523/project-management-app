"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { projectsApi } from "@/lib/api"
import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Empty } from "@/components/ui/empty"
import { FolderOpen } from "lucide-react"

export default function ProjectsPage() {
  const { user } = useAuth()
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [collaborativeProjects, setCollaborativeProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const [owned, collab] = await Promise.all([
        projectsApi.getMyProjects(),
        projectsApi.getCollaborative(),
      ])
      setMyProjects(owned)
      setCollaborativeProjects(collab)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and organize your projects.</p>
        </div>
        <CreateProjectDialog onProjectCreated={fetchProjects} />
      </div>

      <Tabs defaultValue="my-projects" className="w-full">
        <TabsList>
          <TabsTrigger value="my-projects">My Projects ({myProjects.length})</TabsTrigger>
          <TabsTrigger value="collaborative">Collaborative ({collaborativeProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="mt-6">
          {myProjects.length === 0 ? (
            <Empty
              icon={FolderOpen}
              title="No projects yet"
              description="Create your first project to get started."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborative" className="mt-6">
          {collaborativeProjects.length === 0 ? (
            <Empty
              icon={FolderOpen}
              title="No collaborative projects"
              description="You haven't been added to any projects yet."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collaborativeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
