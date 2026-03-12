import type { Funnel } from '@/types'
import { useFunnelStore } from '@/stores'
import { delay } from '@/lib/utils'

export const funnelService = {
  async getAll(accountId: string): Promise<Funnel[]> {
    await delay()
    return useFunnelStore.getState().getByAccount(accountId)
  },

  async getById(id: string): Promise<Funnel | undefined> {
    await delay()
    return useFunnelStore.getState().getById(id)
  },

  async create(name: string, color: string, accountId: string): Promise<Funnel> {
    await delay()
    return useFunnelStore.getState().add(name, color, accountId)
  },

  async update(id: string, data: Partial<Pick<Funnel, 'name' | 'color'>>): Promise<Funnel> {
    await delay()
    return useFunnelStore.getState().update(id, data)
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await delay()
    useFunnelStore.getState().reorder(orderedIds)
  },

  createDefaultFunnels(accountId: string): void {
    useFunnelStore.getState().addDefaults(accountId)
  },
}
