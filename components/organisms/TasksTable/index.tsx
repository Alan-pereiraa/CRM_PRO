'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { formatDateLong } from '@/lib/utils'
import type { Task, TaskStatus, TaskPriority } from '@/types'

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-amber-500' },
  in_progress: { label: 'Em Andamento', color: 'bg-blue-500' },
  completed: { label: 'Concluído', color: 'bg-green-500' },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Baixa', className: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Média', className: 'bg-blue-100 text-blue-700' },
  high: { label: 'Alta', className: 'bg-amber-100 text-amber-700' },
  urgent: { label: 'Urgente', className: 'bg-red-100 text-red-700' },
}

interface TasksTableProps {
  tasks: Task[]
  onToggleComplete: (task: Task) => void
  onTaskClick?: (task: Task) => void
}

export function TasksTable({
  tasks,
  onToggleComplete,
  onTaskClick,
}: TasksTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-[var(--text-secondary)]">Nenhuma tarefa encontrada</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-[#F8FAFC]">
            <th className="w-12 px-4 py-3" />
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Nome da Tarefa
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Prioridade
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Data de Entrega
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const status = STATUS_CONFIG[task.status]
            const priority = PRIORITY_CONFIG[task.priority]

            return (
              <tr
                key={task.id}
                className="border-b hover:bg-[#FAFBFC] cursor-pointer"
                onClick={() => onTaskClick?.(task)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => onToggleComplete(task)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)] line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={priority.className}>
                    {priority.label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${status.color}`} />
                    <span className="text-sm text-[var(--text-primary)]">
                      {status.label}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {formatDateLong(task.dueDate)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
