"use client"

import { useState, useEffect } from "react"
import { coursesApi } from "@/lib/api"
import type { Course, CreateCourseRequest } from "@/lib/types"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Pencil } from "lucide-react"
import { toast } from "sonner"

interface EditCourseDialogProps {
  course: Course
  onCourseUpdated: () => void
}

export function EditCourseDialog({ course, onCourseUpdated }: EditCourseDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(course.name)
  const [description, setDescription] = useState(course.description || "")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(course.name)
      setDescription(course.description || "")
    }
  }, [open, course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

        const updateData: CreateCourseRequest = {
            name: name.trim(),
            description: description.trim(),
            creatorId: null
        }
      await coursesApi.updateCourse(course.id, updateData)
      
      toast.success("Course updated successfully")
      setOpen(false)
      onCourseUpdated()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update course")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Modify the course information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel htmlFor="edit-course-name">Name</FieldLabel>
              <Input
                id="edit-course-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>
            
            <Field>
              <FieldLabel htmlFor="edit-course-description">Description</FieldLabel>
              <Textarea
                id="edit-course-description"
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
              onClick={() => setOpen(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? <Spinner className="mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}