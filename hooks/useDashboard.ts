"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { dashboardService, taskService } from "@/services"
import { useTaskStore, useAuthStore } from "@/stores"
import type { DashboardOverview } from "@/types"

export function useDashboard() {
  const [baseData, setBaseData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const user = useAuthStore((s) => s.user)
  const tasks = useTaskStore((s) => s.tasks)

  const accountId = user?.id ?? ''

  useEffect(() => {
    if (!accountId) return

    async function fetchOverview() {
      try {
        const overview = await dashboardService.getOverview(accountId)
        setBaseData(overview)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar dados"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [accountId])

  const accountTasks = useMemo(
    () => tasks.filter((t) => t.accountId === accountId),
    [tasks, accountId],
  )

  const data = useMemo<DashboardOverview | null>(() => {
    if (!baseData) return null
    return {
      ...baseData,
      todayTasks: {
        tasks: accountTasks,
        pendingCount: accountTasks.filter((t) => t.status !== 'completed').length,
      },
    }
  }, [baseData, accountTasks])

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    await taskService.updateStatus(id, newStatus)
  }, [tasks])

  return { data, loading, error, toggleTask }
}
