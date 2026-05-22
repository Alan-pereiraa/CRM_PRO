"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import {
  dashboardService,
  taskService,
  funnelService,
  projectService,
} from "@/services"
import {
  useAuthStore,
  useFunnelStore,
  useProjectStore,
  useModuleLoading,
  useModuleError,
} from "@/stores"
import type {
  DashboardOverview,
  RawOverview,
  StatCard,
  FunnelData,
  Task,
} from "@/types"

function buildStats(raw: RawOverview): StatCard[] {
  return [
    {
      id: "stat-projects",
      title: "Projetos Ativos",
      value: String(raw.totalProjects),
      icon: "clipboard",
    },
    {
      id: "stat-contacts",
      title: "Contatos",
      value: String(raw.totalContacts),
      icon: "user-plus",
    },
    {
      id: "stat-tasks",
      title: "Tarefas Concluídas",
      value: `${raw.completedTasks}/${raw.completedTasks + raw.pendingTasks}`,
      icon: "circle-check",
    },
  ]
}

export function useDashboard() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  const [raw, setRaw] = useState<RawOverview | null>(null)

  const user = useAuthStore((s) => s.user)
  const accountId = user?.id ?? ""
  const funnels = useFunnelStore((s) => s.funnels)
  const projects = useProjectStore((s) => s.projects)
  const loading = useModuleLoading("dashboard")
  const error = useModuleError("dashboard")

  useEffect(() => {
    if (!accountId) return

    let cancelled = false

    async function fetchAll() {
      try {
        const [overview, today] = await Promise.all([
          dashboardService.getOverview(),
          taskService.getToday(),
          funnelService.getAll(),
          projectService.getAll(),
        ])
        if (cancelled) return
        setRaw(overview)
        setTodayTasks(today)
      } catch {
        // errors reported via uiStore + toast
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [accountId])

  const funnel: FunnelData = useMemo(() => {
    const stages = funnels.map((f) => ({
      id: f.id,
      name: f.name,
      value: projects.filter((p) => p.funnelId === f.id).length,
    }))
    return { stages, growthPercent: 0 }
  }, [funnels, projects])

  const data = useMemo<DashboardOverview | null>(() => {
    if (!raw) return null
    return {
      stats: buildStats(raw),
      funnel,
      todayTasks: {
        tasks: todayTasks,
        pendingCount: todayTasks.filter((t) => t.status !== "completed").length,
      },
    }
  }, [raw, funnel, todayTasks])

  const toggleTask = useCallback(
    async (id: string) => {
      const task = todayTasks.find((t) => t.id === id)
      if (!task) return

      const newStatus = task.status === "completed" ? "pending" : "completed"
      const updated = await taskService.updateStatus(id, newStatus)
      setTodayTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    },
    [todayTasks],
  )

  return { data, loading, error, toggleTask }
}
