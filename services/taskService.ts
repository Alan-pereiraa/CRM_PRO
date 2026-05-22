import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types'
import { useTaskStore, useUiStore } from '@/stores'
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

async function withErrorReport<T>(fn: () => Promise<T>, fallback: string): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    const message = err instanceof Error ? err.message : fallback
    useUiStore.getState().setError('task', message)
    throw err
  }
}

export const taskService = {
  async getAll(status?: TaskStatus): Promise<Task[]> {
    const ui = useUiStore.getState()
    ui.setLoading('task', true)
    ui.setError('task', null)
    try {
      const query = status ? { status: toApiTaskStatus(status) } : undefined
      const data = await api.get<ApiTask[]>('/tasks', { query })
      const tasks = data.map(taskFromApi)
      useTaskStore.getState().setTasks(tasks)
      return tasks
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar tarefas'
      useUiStore.getState().setError('task', message)
      throw err
    } finally {
      useUiStore.getState().setLoading('task', false)
    }
  },

  async getToday(): Promise<Task[]> {
    return withErrorReport(async () => {
      const data = await api.get<ApiTask[]>('/tasks/today')
      return data.map(taskFromApi)
    }, 'Erro ao carregar tarefas de hoje')
  },

  async getById(id: string): Promise<Task> {
    return withErrorReport(async () => {
      const raw = await api.get<ApiTask>(`/tasks/${id}`)
      const task = taskFromApi(raw)
      useTaskStore.getState().upsertTask(task)
      return task
    }, 'Erro ao carregar tarefa')
  },

  async create(input: CreateTaskInput): Promise<Task> {
    return withErrorReport(async () => {
      const raw = await api.post<ApiTask>('/tasks', toCreatePayload(input))
      const task = taskFromApi(raw)
      useTaskStore.getState().upsertTask(task)
      return task
    }, 'Erro ao criar tarefa')
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    return withErrorReport(async () => {
      const raw = await api.patch<ApiTask>(`/tasks/${id}`, toUpdatePayload(input))
      const task = taskFromApi(raw)
      useTaskStore.getState().upsertTask(task)
      return task
    }, 'Erro ao atualizar tarefa')
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return withErrorReport(async () => {
      const raw = await api.patch<ApiTask>(`/tasks/${id}/status`, {
        status: toApiTaskStatus(status),
      })
      const task = taskFromApi(raw)
      useTaskStore.getState().upsertTask(task)
      return task
    }, 'Erro ao atualizar status da tarefa')
  },

  async delete(id: string): Promise<void> {
    await withErrorReport(async () => {
      await api.delete<void>(`/tasks/${id}`)
    }, 'Erro ao excluir tarefa')
    useTaskStore.getState().removeTask(id)
  },
}
