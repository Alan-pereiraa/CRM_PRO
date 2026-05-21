"use client"

import { useEffect, useMemo } from "react"
import { useFunnelStore, useProjectStore, useModuleLoading, useModuleError } from "@/stores"
import { useAuth } from "@/hooks/useAuth"
import { funnelService, projectService } from "@/services"
import type { FunnelWithProjects } from "@/types"

export function useFunnels() {
  const { user } = useAuth()
  const allFunnels = useFunnelStore((s) => s.funnels)
  const allProjects = useProjectStore((s) => s.projects)
  const funnelLoading = useModuleLoading('funnel')
  const projectLoading = useModuleLoading('project')
  const funnelError = useModuleError('funnel')
  const projectError = useModuleError('project')

  useEffect(() => {
    if (!user) return
    funnelService.getAll().catch(() => {
    })
    projectService.getAll().catch(() => {
    })
  }, [user])

  const funnels = useMemo<FunnelWithProjects[]>(() => {
    return allFunnels.map((funnel) => ({
      ...funnel,
      projects: allProjects
        .filter((p) => p.funnelId === funnel.id)
        .sort((a, b) => a.position - b.position),
    }))
  }, [allFunnels, allProjects])

  return {
    funnels,
    loading: funnelLoading || projectLoading,
    error: funnelError ?? projectError,
  }
}
