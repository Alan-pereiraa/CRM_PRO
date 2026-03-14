"use client"

import { DndContext, DragOverlay } from "@dnd-kit/core"
import { KanbanColumn } from "@/components/organisms/KanbanColumn"
import { KanbanCard } from "@/components/molecules/KanbanCard"
import { useKanban } from "@/hooks/useKanban"
import type { FunnelWithProjects } from "@/types"

interface FunnelKanbanViewProps {
  funnels: FunnelWithProjects[]
}

export function FunnelKanbanView({ funnels }: FunnelKanbanViewProps) {
  const {
    columns,
    activeProject,
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useKanban(funnels)

  return (
    <div className="mt-6 flex min-h-0 flex-1 gap-4 overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {funnels.map((funnel) => (
          <KanbanColumn
            key={funnel.id}
            funnel={funnel}
            projects={columns[funnel.id] ?? []}
          />
        ))}

        <DragOverlay>
          {activeProject ? (
            <KanbanCard project={activeProject} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
