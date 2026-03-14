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
import type { FunnelWithProjects, Project } from "@/types"
import { projectService } from "@/services/projectService"

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

function persistPositions(cols: Columns) {
  const updates: Array<{ id: string; funnelId: string; position: number }> = []
  for (const [funnelId, projects] of Object.entries(cols)) {
    projects.forEach((p, i) => updates.push({ id: p.id, funnelId, position: i }))
  }
  projectService.reorderProjects(updates)
}

export function useKanban(funnels: FunnelWithProjects[]) {
  const [columns, setColumns] = useState<Columns>(() => buildColumns(funnels))
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    if (!isDragging.current) setColumns(buildColumns(funnels))
  }, [funnels])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  function handleDragStart({ active }: DragStartEvent) {
    isDragging.current = true
    const container = findContainer(columns, active.id)
    if (!container) return
    const project = columns[container].find((p) => p.id === String(active.id))
    if (project) setActiveProject(project)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
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
        persistPositions(next)
      } else {
        persistPositions(columns)
      }
    } else {
      persistPositions(columns)
    }

    setActiveProject(null)
  }

  function handleDragCancel() {
    isDragging.current = false
    setActiveProject(null)
    setColumns(buildColumns(funnels))
  }

  return {
    columns,
    activeProject,
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  }
}
