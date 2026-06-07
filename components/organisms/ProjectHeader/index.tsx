'use client'

import { Plus, Ellipsis, Trash2, CalendarDays, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import type { Project } from '@/types'
import { formatTrackedTime, formatDateLong, ProjectStats } from '@/lib/utils'

interface ProjectHeaderProps {
  project: Project
  stats: ProjectStats
  onCreateTask?: () => void
  onDelete: () => void
}

export function ProjectHeader({ project, stats, onCreateTask, onDelete }: ProjectHeaderProps) {
  const activePercent = stats.totalTasks > 0
    ? Math.round((stats.activeTasks / stats.totalTasks) * 100)
    : 0

  const avgMinutesPerTask = stats.totalTasks > 0
    ? Math.round(stats.trackedTimeMinutes / stats.totalTasks)
    : 0

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            {project.title}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {project.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            onClick={onCreateTask}
            className="bg-[var(--button-default)] text-white hover:bg-[var(--button-default)]/90"
          >
            <Plus size={16} />
            Criar Tarefa
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[var(--button-default)] bg-[var(--button-default)] text-white hover:bg-[var(--button-default)]/90 hover:text-white"
                >
                  <Ellipsis size={16} />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onDelete}
                className="text-[var(--text-danger)] focus:text-[var(--text-danger)]"
              >
                <Trash2 size={14} />
                Excluir projeto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#F1F5F9] dark:border-border bg-[#F8FAFC] dark:bg-muted p-4 md:grid-cols-3">
        <div className="rounded-xl bg-white dark:bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide text-[var(--text-secondary)] uppercase">
              Progresso Geral
            </span>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              {stats.progress}%
            </span>
          </div>
          <ProgressBar value={stats.progress} className="mt-3" />
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <CalendarDays size={12} />
            <span>Prazo: {formatDateLong(project.deadline)}</span>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-card p-5">
          <span className="text-xs font-bold tracking-wide text-[var(--text-secondary)] uppercase">
            Tarefas Ativas
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {stats.activeTasks}
            </span>
            {stats.totalTasks > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-[var(--text-green)]">
                <TrendingUp size={12} />
                ~{activePercent}%
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {stats.tasksDueThisWeek > 0
              ? `${stats.tasksDueThisWeek} ${stats.tasksDueThisWeek === 1 ? 'tarefa vencendo' : 'tarefas vencendo'} esta semana`
              : 'Nenhuma tarefa vencendo esta semana'}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-card p-5">
          <span className="text-xs font-bold tracking-wide text-[var(--text-secondary)] uppercase">
            Tempo Rastreado
          </span>
          <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            {formatTrackedTime(stats.trackedTimeMinutes)}
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {stats.totalTasks > 0
              ? `Média de ${formatTrackedTime(avgMinutesPerTask)} por tarefa`
              : 'Nenhuma tarefa registrada'}
          </p>
        </div>
      </div>
    </div>
  )
}
