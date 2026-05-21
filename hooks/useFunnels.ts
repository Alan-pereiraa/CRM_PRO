"use client"

import { useEffect, useMemo } from "react"
import { useFunnelStore, useProjectStore, useModuleLoading, useModuleError } from "@/stores"
import { useAuth } from "@/hooks/useAuth"
import { funnelService } from "@/services"
import type { FunnelWithProjects } from "@/types"

export function useFunnels() {
  const { user } = useAuth()
  const allFunnels = useFunnelStore((s) => s.funnels)
  const allProjects = useProjectStore((s) => s.projects)
  const loading = useModuleLoading('funnel')
  const error = useModuleError('funnel')

  useEffect(() => {
    if (!user) return
    funnelService.getAll().catch(() => {
    
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

  return { funnels, loading, error }
}
