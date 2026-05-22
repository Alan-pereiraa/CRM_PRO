'use client'

import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'
import { useAuthStore } from '@/stores'
import { dashboardKeys } from './queryKeys'
import { useProjects } from './useProjects'
import { useFunnels } from './useFunnels'
import { useTodayTasks, useUpdateTaskStatus } from './useTasks'
import type {
  DashboardOverview,
  FunnelData,
  RawOverview,
  StatCard,
} from '@/types'

function buildStats(raw: RawOverview): StatCard[] {
  return [
    {
      id: 'stat-projects',
      title: 'Projetos Ativos',
      value: String(raw.totalProjects),
      icon: 'clipboard',
    },
    {
      id: 'stat-contacts',
      title: 'Contatos',
      value: String(raw.totalContacts),
      icon: 'user-plus',
    },
    {
      id: 'stat-tasks',
      title: 'Tarefas Concluídas',
      value: `${raw.completedTasks}/${raw.completedTasks + raw.pendingTasks}`,
      icon: 'circle-check',
    },
  ]
}

interface UseDashboardResult {
  data: DashboardOverview | null
  loading: boolean
  error: string | null
  toggleTask: (id: string) => void
}

export function useDashboard(): UseDashboardResult {
  const user = useAuthStore((s) => s.user)

  const overviewQuery = useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: ({ signal }) => dashboardService.getOverview({ signal }),
    enabled: !!user,
  })

  const todayQuery = useTodayTasks()
  const funnelsQuery = useFunnels()
  const projectsQuery = useProjects()
  const updateStatus = useUpdateTaskStatus()

  const funnel: FunnelData = useMemo(() => {
    const funnels = funnelsQuery.data ?? []
    const projects = projectsQuery.data ?? []
    const stages = funnels.map((f) => ({
      id: f.id,
      name: f.name,
      value: projects.filter((p) => p.funnelId === f.id).length,
    }))
    return { stages, growthPercent: 0 }
  }, [funnelsQuery.data, projectsQuery.data])

  const data = useMemo<DashboardOverview | null>(() => {
    const raw = overviewQuery.data
    if (!raw) return null
    const todayTasks = todayQuery.data ?? []
    return {
      stats: buildStats(raw),
      funnel,
      todayTasks: {
        tasks: todayTasks,
        pendingCount: todayTasks.filter((t) => t.status !== 'completed').length,
      },
    }
  }, [overviewQuery.data, funnel, todayQuery.data])

  const toggleTask = useCallback(
    (id: string) => {
      const tasks = todayQuery.data ?? []
      const task = tasks.find((t) => t.id === id)
      if (!task) return
      const next = task.status === 'completed' ? 'pending' : 'completed'
      updateStatus.mutate({ id, status: next })
    },
    [todayQuery.data, updateStatus],
  )

  const error =
    (overviewQuery.error instanceof Error && overviewQuery.error.message) ||
    (todayQuery.error instanceof Error && todayQuery.error.message) ||
    null

  return {
    data,
    loading:
      overviewQuery.isLoading ||
      todayQuery.isLoading ||
      funnelsQuery.isLoading ||
      projectsQuery.isLoading,
    error,
    toggleTask,
  }
}
