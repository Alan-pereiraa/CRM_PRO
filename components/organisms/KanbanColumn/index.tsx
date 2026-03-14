"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "@/components/molecules/KanbanCard"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { FunnelWithProjects, Project } from "@/types"

interface KanbanColumnProps {
  funnel: FunnelWithProjects
  projects: Project[]
}

export function KanbanColumn({ funnel, projects }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: funnel.id })

  const totalValue = projects.reduce((sum, p) => sum + p.value, 0)
  const projectIds = projects.map((p) => p.id)

  return (
    <div className="flex w-80 min-w-80 flex-col overflow-hidden rounded-lg bg-[#F5F5F5]">
      <div
        className="rounded-t-lg border-t-[3px] px-4 pt-3 pb-2"
        style={{ borderTopColor: funnel.color }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--text-primary)]">
            {funnel.name}
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {projects.length}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
          {formatCurrency(totalValue)}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-2"
      >
        <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} />
          ))}
        </SortableContext>

        {projects.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-[var(--text-secondary)]">
            Nenhum projeto
          </div>
        )}
      </div>
    </div>
  )
}
