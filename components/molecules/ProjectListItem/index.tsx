"use client"

import { Calendar, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Project, ProjectPriority } from "@/types"

interface ProjectListItemProps {
  project: Project
  onEdit?: (project: Project) => void
}

const PRIORITY_CONFIG: Record<ProjectPriority, { label: string; className: string }> = {
  low: { label: "Baixa", className: "bg-slate-100 text-slate-600" },
  medium: { label: "Média", className: "bg-blue-100 text-blue-700" },
  high: { label: "Alta", className: "bg-amber-100 text-amber-700" },
  urgent: { label: "Urgente", className: "bg-red-100 text-red-700" },
}

export function ProjectListItem({ project, onEdit }: ProjectListItemProps) {
  const priority = PRIORITY_CONFIG[project.priority]

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 transition-colors hover:bg-[#FAFBFC]">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
          {project.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
          {project.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden items-center gap-1 text-xs text-[var(--text-secondary)] sm:flex">
          {formatCurrency(project.value)}
        </span>

        <span
          className={`text-[var(--text-secondary)] hidden items-center gap-1 text-xs md:flex`}
        >
          <Calendar size={12} />
          {formatDate(project.deadline)}
        </span>
        <Badge className={`${priority.className} min-w-20`}>
          {priority.label}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-gray-600"
          onClick={() => onEdit?.(project)}
        >
          <MoreVertical size={14} />
        </Button>
      </div>
    </div>
  )
}
