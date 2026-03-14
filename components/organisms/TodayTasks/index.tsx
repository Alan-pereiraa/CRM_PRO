"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { TodayTasks as TodayTasksType, Task } from "@/types"

interface TodayTasksProps {
  data: TodayTasksType
  onToggle: (id: string) => void
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
}

function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li className="flex items-start gap-3 py-3">
      <Checkbox
        className="mt-0.5"
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
      />

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-tight ${task.done ? "text-[var(--text-secondary)] line-through" : "font-medium text-[var(--text-primary)]"}`}
        >
          {task.title}
        </p>
      </div>
    </li>
  )
}

export function TodayTasks({ data, onToggle }: TodayTasksProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] p-5">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Afazeres de Hoje
        </h2>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
          {data.pendingCount} PENDENTES
        </span>
      </div>

      <ul className="mt-2 flex-1 divide-y divide-[#F1F5F9]">
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} />
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 w-full rounded-lg border border-[#E2E8F0] py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[#F1F5F9]"
      >
        Ver Todas as Tarefas
      </button>
    </div>
  )
}
