import type { Funnel } from '@/types'
import { api } from '@/lib/api'

interface RequestOpts {
  signal?: AbortSignal
}

export const funnelService = {
  async getAll(opts: RequestOpts = {}): Promise<Funnel[]> {
    return api.get<Funnel[]>('/funnels', { signal: opts.signal })
  },

  async getById(id: string, opts: RequestOpts = {}): Promise<Funnel> {
    return api.get<Funnel>(`/funnels/${id}`, { signal: opts.signal })
  },

  async create(name: string, color: string, position: number): Promise<Funnel> {
    return api.post<Funnel>('/funnels', { name, color, position })
  },

  async update(
    id: string,
    data: Partial<Pick<Funnel, 'name' | 'color'>>,
  ): Promise<Funnel> {
    return api.put<Funnel>(`/funnels/${id}`, data)
  },

  async updatePosition(id: string, position: number): Promise<Funnel> {
    return api.patch<Funnel>(`/funnels/${id}/position`, { position })
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await Promise.all(
      orderedIds.map((id, i) =>
        api.patch<Funnel>(`/funnels/${id}/position`, { position: i }),
      ),
    )
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/funnels/${id}`)
  },
}
