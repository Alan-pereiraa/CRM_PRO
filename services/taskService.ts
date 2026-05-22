import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types'
import { api } from '@/lib/api'
import {
  toApiTaskStatus,
  fromApiTaskStatus,
  toApiPriority,
  fromApiPriority,
  type ApiTaskStatus,
  type ApiPriority,
} from '@/lib/mappers'

export interface ApiTask {
  id: string
  title: string
  description: string | null
  status: ApiTaskStatus
  priority: ApiPriority
  dueDate: string | null
  projectId: string
  createdAt: string
  updatedAt: string
}

interface RequestOpts {
  signal?: AbortSignal
}

export function taskFromApi(t: ApiTask): Task {
  const status = fromApiTaskStatus(t.status)
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    status,
    priority: fromApiPriority(t.priority),
    dueDate: t.dueDate ?? '',
    projectId: t.projectId,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    completedAt: status === 'completed' ? t.updatedAt : undefined,
  }
}

function toCreatePayload(input: CreateTaskInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: input.title,
    status: toApiTaskStatus(input.status),
    priority: toApiPriority(input.priority),
    projectId: input.projectId,
  }
  if (input.description) payload.description = input.description
  if (input.dueDate) payload.dueDate = input.dueDate
  return payload
}

function toUpdatePayload(input: UpdateTaskInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (input.title !== undefined) payload.title = input.title
  if (input.description !== undefined) payload.description = input.description
  if (input.status !== undefined) payload.status = toApiTaskStatus(input.status)
  if (input.priority !== undefined) payload.priority = toApiPriority(input.priority)
  if (input.dueDate) payload.dueDate = input.dueDate
  return payload
}

export const taskService = {
  async getAll(status?: TaskStatus, opts: RequestOpts = {}): Promise<Task[]> {
    const query = status ? { status: toApiTaskStatus(status) } : undefined
    const data = await api.get<ApiTask[]>('/tasks', { query, signal: opts.signal })
    return data.map(taskFromApi)
  },

  async getToday(opts: RequestOpts = {}): Promise<Task[]> {
    const data = await api.get<ApiTask[]>('/tasks/today', { signal: opts.signal })
    return data.map(taskFromApi)
  },

  async getById(id: string, opts: RequestOpts = {}): Promise<Task> {
    const raw = await api.get<ApiTask>(`/tasks/${id}`, { signal: opts.signal })
    return taskFromApi(raw)
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const raw = await api.post<ApiTask>('/tasks', toCreatePayload(input))
    return taskFromApi(raw)
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const raw = await api.patch<ApiTask>(`/tasks/${id}`, toUpdatePayload(input))
    return taskFromApi(raw)
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const raw = await api.patch<ApiTask>(`/tasks/${id}/status`, {
      status: toApiTaskStatus(status),
    })
    return taskFromApi(raw)
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/tasks/${id}`)
  },
}
