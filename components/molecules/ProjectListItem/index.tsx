"use client"

import { useRouter } from "next/navigation"
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
  low: { label: "Baixa", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  medium: { label: "Média", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  high: { label: "Alta", className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  urgent: { label: "Urgente", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
}

export function ProjectListItem({ project, onEdit }: ProjectListItemProps) {
  const router = useRouter()
  const priority = PRIORITY_CONFIG[project.priority]

  return (
    <div
      onClick={() => router.push(`/project/${project.id}`)}
      className="cursor-pointer flex items-center justify-between gap-4 rounded-lg border bg-white dark:bg-card px-4 py-3 transition-colors hover:bg-[#FAFBFC] dark:hover:bg-muted"
    >
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
          className="h-7 w-7 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); onEdit?.(project) }}
        >
          <MoreVertical size={14} />
        </Button>
      </div>
    </div>
  )
}
