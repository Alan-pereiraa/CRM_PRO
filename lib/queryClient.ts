import { QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api'
import { useAuthStore } from '@/stores'

function handleGlobalError(err: unknown): void {
  if (!(err instanceof ApiError)) return
  if (err.status !== 401) return
  useAuthStore.getState().signOut()
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleGlobalError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (count, err) =>
          err instanceof ApiError && err.status >= 500 && count < 1,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
