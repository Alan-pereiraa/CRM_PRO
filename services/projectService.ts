import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types'
import { useProjectStore } from '@/stores'
import { delay } from '@/lib/utils'

export const projectService = {
  async getAll(accountId: string): Promise<Project[]> {
    await delay()
    return useProjectStore.getState().getByAccount(accountId)
  },

  async getById(id: string): Promise<Project | undefined> {
    await delay()
    return useProjectStore.getState().getById(id)
  },

  async getByFunnel(funnelId: string): Promise<Project[]> {
    await delay()
    return useProjectStore.getState().getByFunnel(funnelId)
  },

  async create(input: CreateProjectInput, accountId: string): Promise<Project> {
    await delay()
    return useProjectStore.getState().add(input, accountId)
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    await delay()
    return useProjectStore.getState().update(id, input)
  },

  async move(id: string, funnelId: string, position: number): Promise<Project> {
    await delay()
    return useProjectStore.getState().move(id, funnelId, position)
  },

  async delete(id: string): Promise<void> {
    await delay()
    useProjectStore.getState().remove(id)
  },

  createDefaultProjects(funnelIds: string[], accountId: string): string[] {
    return useProjectStore.getState().addDefaults(funnelIds, accountId)
  },
}
