import { create } from 'zustand'
import type { Funnel } from '@/types'

interface FunnelState {
  funnels: Funnel[]
  setFunnels: (funnels: Funnel[]) => void
  upsertFunnel: (funnel: Funnel) => void
  removeFunnel: (id: string) => void
}

function sortByPosition(funnels: Funnel[]): Funnel[] {
  return [...funnels].sort((a, b) => a.position - b.position)
}

export const useFunnelStore = create<FunnelState>()((set) => ({
  funnels: [],

  setFunnels: (funnels) => set({ funnels: sortByPosition(funnels) }),

  upsertFunnel: (funnel) =>
    set((state) => {
      const exists = state.funnels.some((f) => f.id === funnel.id)
      const next = exists
        ? state.funnels.map((f) => (f.id === funnel.id ? funnel : f))
        : [...state.funnels, funnel]
      return { funnels: sortByPosition(next) }
    }),

  removeFunnel: (id) =>
    set((state) => ({ funnels: state.funnels.filter((f) => f.id !== id) })),
}))
