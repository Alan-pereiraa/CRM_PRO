"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { ProjectListItem } from "@/components/molecules/ProjectListItem"
import { formatCurrency } from "@/lib/utils"
import type { FunnelWithProjects } from "@/types"

interface FunnelListGroupProps {
  funnel: FunnelWithProjects
}

export function FunnelListGroup({ funnel }: FunnelListGroupProps) {
  const [expanded, setExpanded] = useState(true)
  const totalValue = funnel.projects.reduce((sum, p) => sum + p.value, 0)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#F8FAFC]"
      >
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: funnel.color }}
        />
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {funnel.name}
        </span>
        <span className="rounded-md bg-[#F1F5F9] px-1.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
          {funnel.projects.length}
        </span>
        <span className="ml-auto text-xs text-[var(--text-secondary)]">
          {formatCurrency(totalValue)}
        </span>
        {expanded ? (
          <ChevronDown size={16} className="shrink-0 text-[var(--text-gray-light)]" />
        ) : (
          <ChevronRight size={16} className="shrink-0 text-[var(--text-gray-light)]" />
        )}
      </button>

      {expanded && (
        <div className="mt-1 flex flex-col gap-2 pl-2">
          {funnel.projects.length > 0 ? (
            funnel.projects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))
          ) : (
            <p className="px-4 py-3 text-center text-xs text-[var(--text-gray-light)]">
              Nenhum projeto neste funil
            </p>
          )}
        </div>
      )}
    </div>
  )
}
