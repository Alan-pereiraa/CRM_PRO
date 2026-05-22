'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { funnelService } from '@/services/funnelService'
import { useAuthStore } from '@/stores'
import { funnelKeys, projectKeys } from './queryKeys'
import { useProjects } from './useProjects'
import type { Funnel, FunnelWithProjects } from '@/types'

function toastError(fallback: string) {
  return (err: unknown) => {
    toast.error(err instanceof Error ? err.message : fallback)
  }
}

export function useFunnels() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: funnelKeys.list(),
    queryFn: ({ signal }) => funnelService.getAll({ signal }),
    enabled: !!user,
  })
}

export interface FunnelsWithProjectsResult {
  funnels: FunnelWithProjects[]
  loading: boolean
  error: string | null
}

export function useFunnelsWithProjects(): FunnelsWithProjectsResult {
  const funnelsQuery = useFunnels()
  const projectsQuery = useProjects()

  const funnels = useMemo<FunnelWithProjects[]>(() => {
    const allFunnels = funnelsQuery.data ?? []
    const allProjects = projectsQuery.data ?? []
    return allFunnels.map((funnel) => ({
      ...funnel,
      projects: allProjects
        .filter((p) => p.funnelId === funnel.id)
        .sort((a, b) => a.position - b.position),
    }))
  }, [funnelsQuery.data, projectsQuery.data])

  const error =
    (funnelsQuery.error instanceof Error && funnelsQuery.error.message) ||
    (projectsQuery.error instanceof Error && projectsQuery.error.message) ||
    null

  return {
    funnels,
    loading: funnelsQuery.isLoading || projectsQuery.isLoading,
    error,
  }
}

export function useCreateFunnel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) => {
      const existing = qc.getQueryData<Funnel[]>(funnelKeys.list()) ?? []
      const position =
        existing.reduce((max, f) => (f.position > max ? f.position : max), -1) + 1
      return funnelService.create(name, color, position)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: funnelKeys.all })
    },
    onError: toastError('Erro ao criar funil'),
  })
}

export function useUpdateFunnel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<Funnel, 'name' | 'color'>>
    }) => funnelService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: funnelKeys.all })
    },
    onError: toastError('Erro ao atualizar funil'),
  })
}

export function useReorderFunnels() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: string[]) => funnelService.reorder(orderedIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: funnelKeys.all })
    },
    onError: toastError('Erro ao reordenar funis'),
  })
}

export function useDeleteFunnel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => funnelService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: funnelKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: toastError('Erro ao excluir funil'),
  })
}
