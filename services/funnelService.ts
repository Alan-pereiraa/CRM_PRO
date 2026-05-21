import type { Funnel } from '@/types'
import { useFunnelStore, useUiStore } from '@/stores'
import { api } from '@/lib/api'

function reportError(message: string): void {
  useUiStore.getState().setError('funnel', message)
}

async function withErrorReport<T>(promise: Promise<T>, fallback: string): Promise<T> {
  try {
    return await promise
  } catch (err) {
    const message = err instanceof Error ? err.message : fallback
    reportError(message)
    throw err
  }
}

export const funnelService = {
  async getAll(): Promise<Funnel[]> {
    const ui = useUiStore.getState()
    ui.setLoading('funnel', true)
    ui.setError('funnel', null)
    try {
      const funnels = await api.get<Funnel[]>('/funnels')
      useFunnelStore.getState().setFunnels(funnels)
      return funnels
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar funis'
      reportError(message)
      throw err
    } finally {
      useUiStore.getState().setLoading('funnel', false)
    }
  },

  async getById(id: string): Promise<Funnel> {
    return withErrorReport(api.get<Funnel>(`/funnels/${id}`), 'Erro ao carregar funil')
  },

  async create(name: string, color: string): Promise<Funnel> {
    const existing = useFunnelStore.getState().funnels
    const position = existing.reduce((max, f) => (f.position > max ? f.position : max), -1) + 1
    const funnel = await withErrorReport(
      api.post<Funnel>('/funnels', { name, color, position }),
      'Erro ao criar funil',
    )
    useFunnelStore.getState().upsertFunnel(funnel)
    return funnel
  },

  async update(id: string, data: Partial<Pick<Funnel, 'name' | 'color'>>): Promise<Funnel> {
    const funnel = await withErrorReport(
      api.put<Funnel>(`/funnels/${id}`, data),
      'Erro ao atualizar funil',
    )
    useFunnelStore.getState().upsertFunnel(funnel)
    return funnel
  },

  async updatePosition(id: string, position: number): Promise<Funnel> {
    const funnel = await withErrorReport(
      api.patch<Funnel>(`/funnels/${id}/position`, { position }),
      'Erro ao reordenar funil',
    )
    useFunnelStore.getState().upsertFunnel(funnel)
    return funnel
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await withErrorReport(
      Promise.all(
        orderedIds.map((id, i) => api.patch<Funnel>(`/funnels/${id}/position`, { position: i })),
      ),
      'Erro ao reordenar funis',
    )
    await funnelService.getAll()
  },

  async delete(id: string): Promise<void> {
    await withErrorReport(api.delete<void>(`/funnels/${id}`), 'Erro ao excluir funil')
    useFunnelStore.getState().removeFunnel(id)
  },
}
