import { create } from 'zustand'
import { toast } from 'sonner'

export type UiModule =
  | 'auth'
  | 'funnel'
  | 'project'
  | 'task'
  | 'contact'
  | 'dashboard'

type LoadingMap = Partial<Record<UiModule, boolean>>
type ErrorMap = Partial<Record<UiModule, string | null>>

interface UiState {
  loading: LoadingMap
  errors: ErrorMap
  setLoading: (key: UiModule, loading: boolean) => void
  setError: (key: UiModule, error: string | null) => void
}

export const useUiStore = create<UiState>()((set) => ({
  loading: {},
  errors: {},

  setLoading: (key, loading) =>
    set((state) => ({ loading: { ...state.loading, [key]: loading } })),

  setError: (key, error) => {
    set((state) => ({ errors: { ...state.errors, [key]: error } }))
    if (error) toast.error(error)
  },
}))

export const useModuleLoading = (key: UiModule): boolean =>
  useUiStore((s) => !!s.loading[key])

export const useModuleError = (key: UiModule): string | null =>
  useUiStore((s) => s.errors[key] ?? null)
