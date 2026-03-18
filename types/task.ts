export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type { TaskPriority } from './dashboard'

export interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
}
