import type { RawOverview } from '@/types'
import { useUiStore } from '@/stores'
import { api } from '@/lib/api'

export const dashboardService = {
  async getOverview(): Promise<RawOverview> {
    const ui = useUiStore.getState()
    ui.setLoading('dashboard', true)
    ui.setError('dashboard', null)
    try {
      return await api.get<RawOverview>('/dashboard/overview')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dashboard'
      useUiStore.getState().setError('dashboard', message)
      throw err
    } finally {
      useUiStore.getState().setLoading('dashboard', false)
    }
  },
}
