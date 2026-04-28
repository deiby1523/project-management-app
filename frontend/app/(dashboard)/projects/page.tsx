"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { projectsApi } from "@/lib/api"
import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
// Se asume la existencia de EditProjectDialog
import { EditProjectDialog } from "@/components/projects/edit-project-dialog" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Empty } from "@/components/ui/empty"
import { FolderOpen } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
  const { user } = useAuth()
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [collaborativeProjects, setCollaborativeProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados para acciones de las tarjetas
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setIsLoading(false) // Corrección del spinner infinito
      return
    }

    setIsLoading(true)
    try {
      const [owned, collab] = await Promise.all([
        projectsApi.getMyProjects(),
        projectsApi.getCollaborative(),
      ])
      setMyProjects(owned)
      setCollaborativeProjects(collab)
    } catch (error) {
      // Corrección del error silencioso
      toast.error(error instanceof Error ? error.message : "Failed to fetch projects")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const executeDelete = async () => {
    if (projectToDelete === null) return

    try {
      await projectsApi.deleteProject(projectToDelete)
      toast.success("Project deleted successfully")
      fetchProjects()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project")
    } finally {
      setProjectToDelete(null)
    }
  }

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
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={() => setProjectToEdit(project)}
                  onDelete={() => setProjectToDelete(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborative" className="mt-6">
          {/* Se omite el código vacío por brevedad, es igual al tuyo */}
          {collaborativeProjects.length === 0 ? (
            <Empty
              icon={FolderOpen}
              title="No collaborative projects"
              description="You haven't been added to any projects yet."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collaborativeProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  // Dependiendo de tu lógica de negocio, quizás los colaboradores 
                  // no puedan editar o eliminar. Ajusta esto según sea necesario.
                  onEdit={() => setProjectToEdit(project)}
                  onDelete={() => setProjectToDelete(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo de Eliminación */}
      <AlertDialog
        open={projectToDelete !== null}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de Edición */}
      {projectToEdit && (
        <EditProjectDialog
          project={projectToEdit}
          open={!!projectToEdit}
          onOpenChange={(open: boolean) => !open && setProjectToEdit(null)}
          onProjectUpdated={() => {
            fetchProjects()
            setProjectToEdit(null)
          }}
        />
      )}
    </div>
  )
}