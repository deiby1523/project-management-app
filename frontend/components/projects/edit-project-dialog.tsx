"use client"

import { useState, useEffect } from "react"
import { projectsApi, coursesApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context" // Importante
import type { Course, CreateProjectRequest, Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

interface EditProjectDialogProps {
  project: Project
  open: boolean // Controlado desde el padre
  onOpenChange: (open: boolean) => void // Controlado desde el padre
  onProjectUpdated: () => void
}

export function EditProjectDialog({ 
  project, 
  open, 
  onOpenChange, 
  onProjectUpdated 
}: EditProjectDialogProps) {
  const { user } = useAuth()
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description || "")
  const [courseId, setCourseId] = useState<string>(project.courseId?.toString() || "none")
  
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Sincronizar datos cuando el diálogo se abre
  useEffect(() => {
    if (open) {
      setName(project.name)
      setDescription(project.description || "")
      setCourseId(project.courseId?.toString() || "none")
      
      const fetchCourses = async () => {
        setIsLoadingCourses(true)
        try {
          const data = await coursesApi.getCourses()
          setCourses(data)
        } catch (error) {
          toast.error("Failed to load courses")
        } finally {
          setIsLoadingCourses(false)
        }
      }
      fetchCourses()
    }
  }, [open, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !user) return

    setIsLoading(true)
    try {
      const courseIdFinal = courseId === "none" ? null : parseInt(courseId, 10)

      const updateData: CreateProjectRequest = {
        name: name.trim(),
        description: description.trim(),
        courseId: courseIdFinal,
        creatorId: user.id, // Usar el ID real del usuario
      }

      await projectsApi.update(project.id, updateData)
      toast.success("Project updated successfully")
      onProjectUpdated() // El padre cerrará el diálogo
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the details of your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel htmlFor="edit-project-course">Course</FieldLabel>
              <Select
                value={courseId}
                onValueChange={setCourseId}
                disabled={isLoading || isLoadingCourses}
              >
                <SelectTrigger id="edit-project-course">
                  <SelectValue placeholder={isLoadingCourses ? "Loading..." : "Select a course"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-project-name">Name</FieldLabel>
              <Input
                id="edit-project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>
            
            <Field>
              <FieldLabel htmlFor="edit-project-description">Description</FieldLabel>
              <Textarea
                id="edit-project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Spinner className="mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}