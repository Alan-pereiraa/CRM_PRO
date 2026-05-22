import type {
  Project,
  Task,
  Contact,
  Funnel,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
} from '@/types'
import {
  useProjectStore,
  useTaskStore,
  useContactStore,
  useUiStore,
} from '@/stores'
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

async function withErrorReport<T>(fn: () => Promise<T>, fallback: string): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    const message = err instanceof Error ? err.message : fallback
    useUiStore.getState().setError('project', message)
    throw err
  }
}

export const projectService = {
  async getAll(): Promise<Project[]> {
    const ui = useUiStore.getState()
    ui.setLoading('project', true)
    ui.setError('project', null)
    try {
      const data = await api.get<ApiProject[]>('/projects')
      const projects = data.map(projectFromApi)
      useProjectStore.getState().setProjects(projects)
      return projects
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar projetos'
      useUiStore.getState().setError('project', message)
      throw err
    } finally {
      useUiStore.getState().setLoading('project', false)
    }
  },

  async getById(id: string): Promise<Project> {
    return withErrorReport(async () => {
      const raw = await api.get<ApiProject>(`/projects/${id}`)
      const project = projectFromApi(raw)
      useProjectStore.getState().upsertProject(project)
      return project
    }, 'Erro ao carregar projeto')
  },

  async getByFunnel(funnelId: string): Promise<Project[]> {
    return withErrorReport(async () => {
      const data = await api.get<ApiProject[]>(`/funnels/${funnelId}/projects`)
      return data.map(projectFromApi)
    }, 'Erro ao carregar projetos do funil')
  },

  async getDetails(id: string): Promise<ProjectDetail> {
    return withErrorReport(async () => {
      const raw = await api.get<ApiProjectDetails>(`/projects/${id}/details`)
      const project = projectFromApi(raw)
      const tasks = raw.tasks.map(taskFromApi)
      useProjectStore.getState().upsertProject(project)
      useTaskStore.getState().upsertTasks(tasks)
      useContactStore.getState().upsertContacts(raw.contacts)
      return {
        project,
        tasks,
        contacts: raw.contacts,
        funnel: raw.funnel,
      }
    }, 'Erro ao carregar detalhes do projeto')
  },

  async create(input: CreateProjectInput): Promise<Project> {
    return withErrorReport(async () => {
      const raw = await api.post<ApiProject>('/projects', toCreatePayload(input))
      const project = projectFromApi(raw)
      useProjectStore.getState().upsertProject(project)
      return project
    }, 'Erro ao criar projeto')
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    return withErrorReport(async () => {
      const raw = await api.patch<ApiProject>(`/projects/${id}`, toUpdatePayload(input))
      const project = projectFromApi(raw)
      useProjectStore.getState().upsertProject(project)
      return project
    }, 'Erro ao atualizar projeto')
  },

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    return withErrorReport(async () => {
      const raw = await api.patch<ApiProject>(`/projects/${id}/status`, {
        status: toApiProjectStatus(status),
      })
      const project = projectFromApi(raw)
      useProjectStore.getState().upsertProject(project)
      return project
    }, 'Erro ao atualizar status do projeto')
  },

  async reorderProjects(updates: Array<{ id: string; funnelId: string; position: number }>): Promise<void> {
    await withErrorReport(async () => {
      await Promise.all(
        updates.map((u) =>
          api.patch<ApiProject>(`/projects/${u.id}`, {
            funnelId: u.funnelId,
            position: u.position,
          }),
        ),
      )
    }, 'Erro ao reordenar projetos')
    await projectService.getAll()
  },

  async delete(id: string): Promise<void> {
    await withErrorReport(async () => {
      await api.delete<void>(`/projects/${id}`)
    }, 'Erro ao excluir projeto')
    useProjectStore.getState().removeProject(id)
  },
}
