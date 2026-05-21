import type { ProjectStatus, ProjectPriority } from '@/types'
import type { TaskStatus } from '@/types'

export type ApiProjectStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'
export type ApiPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type ApiTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

const PROJECT_STATUS_TO_API: Record<ProjectStatus, ApiProjectStatus> = {
  active: 'ACTIVE',
  completed: 'COMPLETED',
  paused: 'PAUSED',
  cancelled: 'CANCELLED',
}

const PROJECT_STATUS_FROM_API: Record<ApiProjectStatus, ProjectStatus> = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
}

const PRIORITY_TO_API: Record<ProjectPriority, ApiPriority> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  urgent: 'URGENT',
}

const PRIORITY_FROM_API: Record<ApiPriority, ProjectPriority> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

const TASK_STATUS_TO_API: Record<TaskStatus, ApiTaskStatus> = {
  pending: 'PENDING',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
}

const TASK_STATUS_FROM_API: Record<ApiTaskStatus, TaskStatus> = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

export const toApiProjectStatus = (status: ProjectStatus): ApiProjectStatus =>
  PROJECT_STATUS_TO_API[status]

export const fromApiProjectStatus = (status: ApiProjectStatus): ProjectStatus =>
  PROJECT_STATUS_FROM_API[status]

export const toApiPriority = (priority: ProjectPriority): ApiPriority =>
  PRIORITY_TO_API[priority]

export const fromApiPriority = (priority: ApiPriority): ProjectPriority =>
  PRIORITY_FROM_API[priority]

export const toApiTaskStatus = (status: TaskStatus): ApiTaskStatus =>
  TASK_STATUS_TO_API[status]

export const fromApiTaskStatus = (status: ApiTaskStatus): TaskStatus =>
  TASK_STATUS_FROM_API[status]
