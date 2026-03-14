"use client"

import { useMemo } from "react"
import { useFunnelStore, useProjectStore } from "@/stores"
import { useAuth } from "@/hooks/useAuth"
import type { FunnelWithProjects } from "@/types"

export function useFunnels() {
  const { user } = useAuth()
  const allFunnels = useFunnelStore((s) => s.funnels)
  const allProjects = useProjectStore((s) => s.projects)

  const funnels = useMemo<FunnelWithProjects[]>(() => {
    if (!user) return []
    return allFunnels
      .filter((f) => f.accountId === user.id)
      .sort((a, b) => a.position - b.position)
      .map((funnel) => ({
        ...funnel,
        projects: allProjects
          .filter((p) => p.funnelId === funnel.id)
          .sort((a, b) => a.position - b.position),
      }))
  }, [allFunnels, allProjects, user])

  return { funnels }
}
