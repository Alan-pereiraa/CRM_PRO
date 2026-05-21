"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { KanbanCard } from "@/components/molecules/KanbanCard"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, cn } from "@/lib/utils"
import type { FunnelWithProjects, Project } from "@/types"

interface KanbanColumnProps {
  funnel: FunnelWithProjects
  projects: Project[]
  onEditProject?: (project: Project) => void
  isOverlay?: boolean
}

export function KanbanColumn({ funnel, projects, onEditProject, isOverlay }: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: funnel.id, data: { type: 'funnel' } })

  const { setNodeRef: setDroppableRef } = useDroppable({ id: funnel.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const totalValue = projects.reduce((sum, p) => sum + p.value, 0)
  const projectIds = projects.map((p) => p.id)

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={cn(
        "flex w-80 min-w-80 flex-col overflow-hidden rounded-lg bg-[#F5F5F5] dark:bg-background",
        isDragging && !isOverlay && "opacity-50",
        isOverlay && "shadow-xl rotate-[1deg]",
      )}
    >
      <div
        className="rounded-t-lg border-t-[3px] px-4 pt-3 pb-2"
        style={{ borderTopColor: funnel.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="-ml-1 cursor-grab p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:cursor-grabbing"
              aria-label="Mover funil"
            >
              <GripVertical size={14} />
            </button>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--text-primary)]">
              {funnel.name}
            </h3>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {projects.length}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
          {formatCurrency(totalValue)}
        </p>
      </div>

      <div
        ref={setDroppableRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-2"
      >
        <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} onEdit={onEditProject} />
          ))}
        </SortableContext>

        {projects.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-border text-xs text-[var(--text-secondary)]">
            Nenhum projeto
          </div>
        )}
      </div>
    </div>
  )
}
