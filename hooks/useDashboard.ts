"use client"

import { useEffect, useState } from "react"
import { dashboardService } from "@/services"
import type { DashboardOverview } from "@/types"

export function useDashboard() {
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOverview() {
      try {
        const overview = await dashboardService.getOverview()
        setData(overview)
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

  return { data, loading, error }
}
