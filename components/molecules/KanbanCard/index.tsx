"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Clock, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils"
import type { Project, ProjectPriority } from "@/types"

const PRIORITY_CONFIG: Record<ProjectPriority, { label: string; className: string }> = {
  low: { label: "Baixa", className: "bg-slate-100 text-slate-600" },
  medium: { label: "Média", className: "bg-blue-100 text-blue-700" },
  high: { label: "Alta", className: "bg-amber-100 text-amber-700" },
  urgent: { label: "Urgente", className: "bg-red-100 text-red-700" },
}

interface KanbanCardProps {
  project: Project
  isOverlay?: boolean
  onEdit?: (project: Project) => void
}

export function KanbanCard({ project, isOverlay, onEdit }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priority = PRIORITY_CONFIG[project.priority]
  const initials = project.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 opacity-50 p-4 h-[140px]"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab rounded-lg border bg-white p-4 transition-shadow hover:shadow-md",
        isOverlay && "shadow-xl rotate-[2deg]",
      )}
    >
      <div className="flex items-start justify-between">
        <Badge className={priority.className}>{priority.label}</Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-gray-600"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit?.(project)}
        >
          <MoreVertical size={14} />
        </Button>
      </div>

      <p className="mt-2 text-sm font-medium text-[var(--text-primary)] line-clamp-2">
        {project.title}
      </p>

      <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
        {formatCurrency(project.value)}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <Clock size={12} />
          {formatRelativeTime(project.updatedAt)}
        </span>
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[10px] bg-gray-200 text-gray-600">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
