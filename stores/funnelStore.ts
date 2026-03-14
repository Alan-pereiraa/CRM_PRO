import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Funnel } from '@/types'
import { defaultFunnels } from '@/mocks'
import { generateId } from '@/lib/utils'

interface FunnelState {
  funnels: Funnel[]
  getByAccount: (accountId: string) => Funnel[]
  getById: (id: string) => Funnel | undefined
  add: (name: string, color: string, accountId: string) => Funnel
  update: (id: string, data: Partial<Pick<Funnel, 'name' | 'color'>>) => Funnel
  reorder: (orderedIds: string[]) => void
  addDefaults: (accountId: string) => void
}

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set, get) => ({
      funnels: [],

      getByAccount: (accountId) =>
        get()
          .funnels.filter((f) => f.accountId === accountId)
          .sort((a, b) => a.position - b.position),

      getById: (id) => get().funnels.find((f) => f.id === id),

      add: (name, color, accountId) => {
        const funnels = get().funnels
        const maxPosition = funnels.reduce(
          (max, f) => (f.position > max ? f.position : max),
          -1,
        )
        const newFunnel: Funnel = {
          id: generateId('funnel'),
          name,
          position: maxPosition + 1,
          color,
          accountId,
        }
        set({ funnels: [...funnels, newFunnel] })
        return newFunnel
      },

      update: (id, data) => {
        const funnels = get().funnels.map((f) =>
          f.id === id ? { ...f, ...data } : f,
        )
        const updated = funnels.find((f) => f.id === id)
        if (!updated) throw new Error('Funil nao encontrado')
        set({ funnels })
        return updated
      },

      reorder: (orderedIds) => {
        const funnels = get().funnels.map((f) => {
          const index = orderedIds.indexOf(f.id)
          return index !== -1 ? { ...f, position: index } : f
        })
        set({ funnels })
      },

      addDefaults: (accountId) => {
        const newFunnels: Funnel[] = defaultFunnels.map((seed) => ({
          id: generateId('funnel'),
          name: seed.name,
          position: seed.position,
          color: seed.color,
          accountId,
        }))
        set((state) => ({ funnels: [...state.funnels, ...newFunnels] }))
      },
    }),
    {
      name: 'crm_funnels',
    },
  ),
)
