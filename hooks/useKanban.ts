"use client"

import { useState, useEffect, useRef } from "react"
import {
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type UniqueIdentifier,
  type CollisionDetection,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  closestCorners,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import type { Funnel, FunnelWithProjects, Project } from "@/types"
import { projectService } from "@/services/projectService"
import { funnelService } from "@/services/funnelService"

type Columns = Record<string, Project[]>

function buildColumns(funnels: FunnelWithProjects[]): Columns {
  const cols: Columns = {}
  for (const f of funnels) {
    cols[f.id] = [...f.projects].sort((a, b) => a.position - b.position)
  }
  return cols
}

function findContainer(columns: Columns, id: UniqueIdentifier): string | undefined {
  const strId = String(id)
  if (columns[strId]) return strId
  return Object.keys(columns).find((key) =>
    columns[key].some((p) => p.id === strId),
  )
}

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) return pointerCollisions
  return closestCorners(args)
}

function persistProjectPositions(cols: Columns) {
  const updates: Array<{ id: string; funnelId: string; position: number }> = []
  for (const [funnelId, projects] of Object.entries(cols)) {
    projects.forEach((p, i) => updates.push({ id: p.id, funnelId, position: i }))
  }
  projectService.reorderProjects(updates)
}

export function useKanban(funnels: FunnelWithProjects[]) {
  const [columns, setColumns] = useState<Columns>(() => buildColumns(funnels))
  const [funnelOrder, setFunnelOrder] = useState<string[]>(() => funnels.map((f) => f.id))
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [activeFunnel, setActiveFunnel] = useState<Funnel | null>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    if (!isDragging.current) {
      setColumns(buildColumns(funnels))
      setFunnelOrder(funnels.map((f) => f.id))
    }
  }, [funnels])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  function getActiveType(event: { active: DragStartEvent['active'] }): 'funnel' | 'project' | undefined {
    return event.active.data.current?.type as 'funnel' | 'project' | undefined
  }

  function handleDragStart({ active }: DragStartEvent) {
    isDragging.current = true
    const type = getActiveType({ active })

    if (type === 'funnel') {
      const funnel = funnels.find((f) => f.id === String(active.id))
      if (funnel) setActiveFunnel(funnel)
      return
    }

    const container = findContainer(columns, active.id)
    if (!container) return
    const project = columns[container].find((p) => p.id === String(active.id))
    if (project) setActiveProject(project)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const type = getActiveType({ active })
    if (type === 'funnel') return
    if (!over) return

    const from = findContainer(columns, active.id)
    const to = findContainer(columns, over.id)
    if (!from || !to || from === to) return

    setColumns((prev) => {
      const fromItems = prev[from].filter((p) => p.id !== String(active.id))
      const movedItem = prev[from].find((p) => p.id === String(active.id))
      if (!movedItem) return prev

      const toItems = [...prev[to]]
      const overIndex = toItems.findIndex((p) => p.id === String(over.id))
      toItems.splice(overIndex === -1 ? toItems.length : overIndex, 0, movedItem)

      return { ...prev, [from]: fromItems, [to]: toItems }
    })
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    isDragging.current = false
    const type = getActiveType({ active })

    if (type === 'funnel') {
      if (over && active.id !== over.id) {
        const oldIndex = funnelOrder.indexOf(String(active.id))
        const newIndex = funnelOrder.indexOf(String(over.id))
        if (oldIndex !== -1 && newIndex !== -1) {
          const next = arrayMove(funnelOrder, oldIndex, newIndex)
          setFunnelOrder(next)
          funnelService.reorder(next).catch(() => {
            // error already reported via uiStore + toast
          })
        }
      }
      setActiveFunnel(null)
      return
    }

    if (!over) {
      setActiveProject(null)
      return
    }

    const from = findContainer(columns, active.id)
    const to = findContainer(columns, over.id)

    if (from && to && from === to) {
      const items = columns[from]
      const oldIndex = items.findIndex((p) => p.id === String(active.id))
      const newIndex = items.findIndex((p) => p.id === String(over.id))

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const next = { ...columns, [from]: arrayMove(items, oldIndex, newIndex) }
        setColumns(next)
        persistProjectPositions(next)
      } else {
        persistProjectPositions(columns)
      }
    } else {
      persistProjectPositions(columns)
    }

    setActiveProject(null)
  }

  function handleDragCancel() {
    isDragging.current = false
    setActiveProject(null)
    setActiveFunnel(null)
    setColumns(buildColumns(funnels))
    setFunnelOrder(funnels.map((f) => f.id))
  }

  return {
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
  }
}
