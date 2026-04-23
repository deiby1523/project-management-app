// User types
export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// Project types
export interface Project {
  id: number
  name: string
  courseId: number
  description: string
  creatorId: number
}

export interface Course {
  id: number
  name: string
  description: string
  creatorId: number | null
}

export interface CreateProjectRequest {
  name: string
  courseId: number | null
  description: string
  creatorId: number
}

export interface CreateCourseRequest {
  name: string
  description: string
  creatorId: number
}

// Task types
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  projectId: number
  assignedUserId: number | null
}

export interface CreateTaskRequest {
  title: string
  description: string
  projectId: number
}

export interface AssignTaskRequest {
  assignedUserId: number
}

// Comment types
export interface Comment {
  id: number
  content: string
  taskId: number
  userId: number
}

export interface CreateCommentRequest {
  content: string
  taskId: number
  userId: number
}

// API Error type
export interface ApiError {
  message: string
  status: number
}
