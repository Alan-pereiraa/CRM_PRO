"use client"

import { useMemo } from "react"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanColumn } from "@/components/organisms/KanbanColumn"
import { KanbanCard } from "@/components/molecules/KanbanCard"
import { useKanban } from "@/hooks/useKanban"
import type { FunnelWithProjects, Project } from "@/types"

interface FunnelKanbanViewProps {
  funnels: FunnelWithProjects[]
  onEditProject?: (project: Project) => void
}

export function FunnelKanbanView({ funnels, onEditProject }: FunnelKanbanViewProps) {
  const {
    columns,
    funnelOrder,
    activeProject,
    activeFunnel,
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useKanban(funnels)

  const orderedFunnels = useMemo(() => {
    const byId = new Map(funnels.map((f) => [f.id, f]))
    return funnelOrder
      .map((id) => byId.get(id))
      .filter((f): f is FunnelWithProjects => f !== undefined)
  }, [funnels, funnelOrder])

  const activeFunnelWithProjects = activeFunnel
    ? funnels.find((f) => f.id === activeFunnel.id)
    : null

  return (
    <div className="scrollbar-thin mt-6 flex min-h-0 flex-1 gap-4 overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={funnelOrder} strategy={horizontalListSortingStrategy}>
          {orderedFunnels.map((funnel) => (
            <KanbanColumn
              key={funnel.id}
              funnel={funnel}
              projects={columns[funnel.id] ?? []}
              onEditProject={onEditProject}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeFunnelWithProjects ? (
            <KanbanColumn
              funnel={activeFunnelWithProjects}
              projects={columns[activeFunnelWithProjects.id] ?? []}
              isOverlay
            />
          ) : activeProject ? (
            <KanbanCard project={activeProject} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
