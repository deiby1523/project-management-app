"use client"

import Link from "next/link"
import type { Project } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Pencil, Trash2 } from "lucide-react"
import { CourseTag } from "./course-tag"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  
  // Función para evitar que el clic en el botón active el Link del Card
  const handleAction = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    callback()
  }

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 group relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{project.name}</CardTitle>
                {project.courseId && (
                  <CourseTag courseId={project.courseId} />
                )}
              </div>
            </div>

            {/* Contenedor de acciones */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleAction(e, onEdit)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleAction(e, onDelete)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {project.description || "No description provided"}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}