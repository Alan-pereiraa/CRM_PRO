import type {
  Project,
  Task,
  Contact,
  Funnel,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
} from '@/types'
import { api } from '@/lib/api'
import {
  toApiProjectStatus,
  fromApiProjectStatus,
  toApiPriority,
  fromApiPriority,
  type ApiProjectStatus,
  type ApiPriority,
} from '@/lib/mappers'
import { taskFromApi, type ApiTask } from './taskService'

interface ApiProject {
  id: string
  title: string
  description: string | null
  status: ApiProjectStatus
  priority: ApiPriority
  value: number | null
  deadline: string | null
  position: number
  funnelId: string
  accountId: string
  createdAt: string
  updatedAt: string
}

interface ApiProjectDetails extends ApiProject {
  funnel: Funnel
  tasks: ApiTask[]
  contacts: Contact[]
}

export interface ProjectDetail {
  project: Project
  tasks: Task[]
  contacts: Contact[]
  funnel: Funnel
}

interface RequestOpts {
  signal?: AbortSignal
}

function projectFromApi(p: ApiProject): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? '',
    status: fromApiProjectStatus(p.status),
    priority: fromApiPriority(p.priority),
    value: p.value ?? 0,
    deadline: p.deadline ?? '',
    position: p.position,
    funnelId: p.funnelId,
    accountId: p.accountId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

function toCreatePayload(input: CreateProjectInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: input.title,
    status: toApiProjectStatus(input.status),
    priority: toApiPriority(input.priority),
    funnelId: input.funnelId,
  }
  if (input.description) payload.description = input.description
  if (input.value) payload.value = input.value
  if (input.deadline) payload.deadline = input.deadline
  return payload
}

function toUpdatePayload(input: UpdateProjectInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (input.title !== undefined) payload.title = input.title
  if (input.description !== undefined) payload.description = input.description
  if (input.status !== undefined) payload.status = toApiProjectStatus(input.status)
  if (input.priority !== undefined) payload.priority = toApiPriority(input.priority)
  if (input.value !== undefined) payload.value = input.value
  if (input.deadline) payload.deadline = input.deadline
  if (input.funnelId !== undefined) payload.funnelId = input.funnelId
  return payload
}

export const projectService = {
  async getAll(opts: RequestOpts = {}): Promise<Project[]> {
    const data = await api.get<ApiProject[]>('/projects', { signal: opts.signal })
    return data.map(projectFromApi)
  },

  async getById(id: string, opts: RequestOpts = {}): Promise<Project> {
    const raw = await api.get<ApiProject>(`/projects/${id}`, { signal: opts.signal })
    return projectFromApi(raw)
  },

  async getByFunnel(funnelId: string, opts: RequestOpts = {}): Promise<Project[]> {
    const data = await api.get<ApiProject[]>(`/funnels/${funnelId}/projects`, {
      signal: opts.signal,
    })
    return data.map(projectFromApi)
  },

  async getDetails(id: string, opts: RequestOpts = {}): Promise<ProjectDetail> {
    const raw = await api.get<ApiProjectDetails>(`/projects/${id}/details`, {
      signal: opts.signal,
    })
    return {
      project: projectFromApi(raw),
      tasks: raw.tasks.map(taskFromApi),
      contacts: raw.contacts,
      funnel: raw.funnel,
    }
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const raw = await api.post<ApiProject>('/projects', toCreatePayload(input))
    return projectFromApi(raw)
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const raw = await api.patch<ApiProject>(`/projects/${id}`, toUpdatePayload(input))
    return projectFromApi(raw)
  },

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    const raw = await api.patch<ApiProject>(`/projects/${id}/status`, {
      status: toApiProjectStatus(status),
    })
    return projectFromApi(raw)
  },

  async reorderProjects(
    updates: Array<{ id: string; funnelId: string; position: number }>,
  ): Promise<void> {
    await Promise.all(
      updates.map((u) =>
        api.patch<ApiProject>(`/projects/${u.id}`, {
          funnelId: u.funnelId,
          position: u.position,
        }),
      ),
    )
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/projects/${id}`)
  },
}
