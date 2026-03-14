"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewToggle } from "@/components/atoms/ViewToggle"
import type { FunnelViewMode } from "@/types"

interface FunnelPageHeaderProps {
  view: FunnelViewMode
  onViewChange: (view: FunnelViewMode) => void
  onNewProject: () => void
}

function getCurrentMonthLabel() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const year = String(now.getFullYear()).slice(2)
  return `${month}/${year}`
}

export function FunnelPageHeader({
  view,
  onViewChange,
  onNewProject,
}: FunnelPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Funil de Vendas
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Negócios ativos e oportunidades para o {getCurrentMonthLabel()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ViewToggle view={view} onViewChange={onViewChange} />
        <Button
          onClick={onNewProject}
          className="flex-1 bg-[var(--button-default)] text-white hover:bg-[var(--button-default)]/90 sm:flex-none"
          size="lg"
        >
          <Plus size={16} data-icon="inline-start" />
          Nova Oportunidade
        </Button>
      </div>
    </div>
  )
}
