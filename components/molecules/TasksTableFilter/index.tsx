'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TaskStatus, TaskPriority } from '@/types'

const STATUS_LABELS: Record<TaskStatus | 'all', string> = {
  all: 'Todos',
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
}

const PRIORITY_LABELS: Record<TaskPriority | 'all', string> = {
  all: 'Todas',
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
}

interface TasksTableFilterProps {
  search: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  onSearchChange: (value: string) => void
  onStatusChange: (value: TaskStatus | 'all') => void
  onPriorityChange: (value: TaskPriority | 'all') => void
}

export function TasksTableFilter({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TasksTableFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
        <Input
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-[#F1F5F9] pl-9 border-none"
        />
      </div>

      <Select value={status} onValueChange={(v) => onStatusChange(v as TaskStatus | 'all')}>
        <SelectTrigger className="w-[160px]">
          <span>{STATUS_LABELS[status]}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="in_progress">Em Andamento</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(v) => onPriorityChange(v as TaskPriority | 'all')}>
        <SelectTrigger className="w-[160px]">
          <span>{PRIORITY_LABELS[priority]}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="low">Baixa</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
          <SelectItem value="urgent">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
