import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Project,
  CreateProjectRequest,
  Task,
  CreateTaskRequest,
  AssignTaskRequest,
  Comment,
  CreateCommentRequest,
  Course,
  CreateCourseRequest,
} from "./types"

// Docker
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Dev
const API_BASE_URL = "http://localhost:8080/api";

// Token management
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

export function removeToken(): void {
  localStorage.removeItem("auth_token")
}

// Generic fetch wrapper with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })


  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `HTTP error! status: ${response.status}`)
  }

  // Handle empty responses
  const text = await response.text()
  if (!text) return {} as T
  
  return JSON.parse(text) as T
}

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return fetchWithAuth<User[]>("/users")
  },

  getById: async (id: number): Promise<User> => {
    return fetchWithAuth<User>(`/users/${id}`)
  },

  getByEmail: async (email: string): Promise<User> => {
    return fetchWithAuth<User>(`/users/email/${email}`)
  },
}

// Projects API
export const projectsApi = {

  getCollaborative: async (): Promise<Project[]> => {
    return fetchWithAuth<Project[]>(`/projects/collaborative`)
  },

  getMyProjects: async (): Promise<Project[]> => {
    return fetchWithAuth<Project[]>(`/projects/my`)
  },

  getById: async (id: number): Promise<Project> => {
    return fetchWithAuth<Project>(`/projects/${id}`)
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    return fetchWithAuth<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (projectId: number,data: CreateProjectRequest): Promise<Project> => {
    return fetchWithAuth<Project>(`/projects/update/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  addMember: async (projectId: number, userId: number): Promise<void> => {
    return fetchWithAuth<void>(`/projects/${projectId}/members/${userId}`, {
      method: "POST",
    })
  },

  removeMember: async (projectId: number, userId: number): Promise<void> => {
    return fetchWithAuth<void>(`/projects/${projectId}/members/${userId}`, {
      method: "DELETE",
    })
  },

  getMembers: async (projectId: number): Promise<User[]> => {
    return fetchWithAuth<User[]>(`/projects/${projectId}/members`)
  },

  deleteProject: async (projectId: number): Promise<Project> => {
    return fetchWithAuth<Project>(`/projects/${projectId}`, {
      method: "DELETE",
    })
  },
}

export const coursesApi = {
  getCourses: async (): Promise<Course[]> => {
    return fetchWithAuth<Course[]>(`/courses/`)
  },

  getById: async (id: number): Promise<Course> => {
    return fetchWithAuth<Course>(`/courses/${id}`)
  },

  create: async (data: CreateCourseRequest): Promise<Course> => {
    return fetchWithAuth<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateCourse: async (courseId: number,data: CreateCourseRequest): Promise<Course> => {
    return fetchWithAuth<Course>(`/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteCourse: async (courseId: number): Promise<Course> => {
    return fetchWithAuth<Course>(`/courses/${courseId}`, {
      method: "DELETE",
    })
  },

}

// Tasks API
export const tasksApi = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    return fetchWithAuth<Task[]>(`/tasks/project/${projectId}`)
  },

  getById: async (id: number): Promise<Task> => {
    return fetchWithAuth<Task>(`/tasks/${id}`)
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    return fetchWithAuth<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  assign: async (taskId: number, data: AssignTaskRequest): Promise<Task> => {
    return fetchWithAuth<Task>(`/tasks/${taskId}/assign`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  updateStatus: async (taskId: number, status: string): Promise<Task> => {
    return fetchWithAuth<Task>(`/tasks/${taskId}/status?status=${status}`, {
      method: "PATCH",
    })
  },

  deleteTask: async (taskId: number): Promise<void> => {
    return fetchWithAuth<void>(`/tasks/${taskId}`, {
      method: "DELETE",
    })
  },
}

// Comments API
export const commentsApi = {
  getByTask: async (taskId: number): Promise<Comment[]> => {
    return fetchWithAuth<Comment[]>(`/comments/task/${taskId}`)
  },

  create: async (data: CreateCommentRequest): Promise<Comment> => {
    return fetchWithAuth<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}
