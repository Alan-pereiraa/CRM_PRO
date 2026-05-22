'use client'

import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services'
import { tokenStorage } from '@/lib/tokenStorage'
import type { PublicAccount } from '@/types'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useCurrentUser() {
  return useQuery<PublicAccount | null>({
    queryKey: authKeys.me(),
    queryFn: () => authService.getCurrentUser(),
    enabled: !!tokenStorage.get(),
    staleTime: Infinity,
  })
}
