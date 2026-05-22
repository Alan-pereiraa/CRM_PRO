"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { dashboardService, taskService } from "@/services"
import { useAuthStore } from "@/stores"
import type { DashboardOverview, Task } from "@/types"

export function useDashboard() {
  const [baseData, setBaseData] = useState<DashboardOverview | null>(null)
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const user = useAuthStore((s) => s.user)
  const accountId = user?.id ?? ''

  useEffect(() => {
    if (!accountId) return

    let cancelled = false

    async function fetchData() {
      try {
        const [overview, today] = await Promise.all([
          dashboardService.getOverview(accountId),
          taskService.getToday(),
        ])
        if (cancelled) return
        setBaseData(overview)
        setTodayTasks(today)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : "Erro ao carregar dados"
        setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [accountId])

  const data = useMemo<DashboardOverview | null>(() => {
    if (!baseData) return null
    return {
      ...baseData,
      todayTasks: {
        tasks: todayTasks,
        pendingCount: todayTasks.filter((t) => t.status !== 'completed').length,
      },
    }
  }, [baseData, todayTasks])

  const toggleTask = useCallback(async (id: string) => {
    const task = todayTasks.find((t) => t.id === id)
    if (!task) return

    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    const updated = await taskService.updateStatus(id, newStatus)
    setTodayTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }, [todayTasks])

  return { data, loading, error, toggleTask }
}
