"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { dashboardService, taskService } from "@/services"
import { useTaskStore } from "@/stores"
import type { DashboardOverview } from "@/types"

export function useDashboard() {
  const [baseData, setBaseData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tasks = useTaskStore((s) => s.tasks)

  useEffect(() => {
    async function fetchOverview() {
      try {
        const overview = await dashboardService.getOverview()
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
  }, [])

  const data = useMemo<DashboardOverview | null>(() => {
    if (!baseData) return null
    return {
      ...baseData,
      todayTasks: {
        tasks,
        pendingCount: tasks.filter((t) => !t.done).length,
      },
    }
  }, [baseData, tasks])

  const toggleTask = useCallback(async (id: string) => {
    await taskService.toggle(id)
  }, [])

  return { data, loading, error, toggleTask }
}
