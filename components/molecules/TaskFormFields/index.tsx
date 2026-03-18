"use client"

import { Paperclip } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { CreateTaskInput, TaskStatus, TaskPriority } from "@/types"

interface TaskFormFieldsProps {
  values: CreateTaskInput
  errors: Partial<Record<keyof CreateTaskInput, string>>
  onValueChange: <K extends keyof CreateTaskInput>(
    field: K,
    value: CreateTaskInput[K],
  ) => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em Progresso" },
  { value: "completed", label: "Concluída" },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
]

const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label]),
) as Record<TaskStatus, string>

const PRIORITY_LABELS = Object.fromEntries(
  PRIORITY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<TaskPriority, string>

export function TaskFormFields({
  values,
  errors,
  onValueChange,
}: TaskFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="task-title" className="text-sm font-medium text-[var(--text-primary)]">
          Título
        </Label>
        <Input
          id="task-title"
          placeholder="Nome da tarefa"
          value={values.title}
          onChange={(e) => onValueChange("title", e.target.value)}
          aria-invalid={!!errors.title}
          className="h-10"
        />
        {errors.title && (
          <p className="text-xs text-[var(--text-danger)]">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description" className="text-sm font-medium text-[var(--text-primary)]">
          Descrição
        </Label>
        <Textarea
          id="task-description"
          placeholder="Descreva a tarefa..."
          value={values.description}
          onChange={(e) => onValueChange("description", e.target.value)}
          aria-invalid={!!errors.description}
          rows={3}
          className="resize-none"
        />
        {errors.description && (
          <p className="text-xs text-[var(--text-danger)]">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-dueDate" className="text-sm font-medium text-[var(--text-primary)]">
          Data de Vencimento
        </Label>
        <Input
          id="task-dueDate"
          type="date"
          value={values.dueDate}
          onChange={(e) => onValueChange("dueDate", e.target.value)}
          aria-invalid={!!errors.dueDate}
          className="h-10"
        />
        {errors.dueDate && (
          <p className="text-xs text-[var(--text-danger)]">{errors.dueDate}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-medium text-[var(--text-primary)]">
            Status
          </Label>
          <Select
            value={values.status}
            onValueChange={(val) => onValueChange("status", val as TaskStatus)}
          >
            <SelectTrigger className="h-10 w-full min-w-0">
              <span className="flex flex-1 text-left">
                {STATUS_LABELS[values.status]}
              </span>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-medium text-[var(--text-primary)]">
            Prioridade
          </Label>
          <Select
            value={values.priority}
            onValueChange={(val) => onValueChange("priority", val as TaskPriority)}
          >
            <SelectTrigger className="h-10 w-full min-w-0">
              <span className="flex flex-1 text-left">
                {PRIORITY_LABELS[values.priority]}
              </span>
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-[var(--text-primary)]">
          Anexos
        </Label>
        <div className="flex cursor-not-allowed items-center gap-3 rounded-md border border-dashed border-[var(--border-primary)] bg-muted/40 px-4 py-3 opacity-50">
          <Paperclip className="size-5 shrink-0 text-[var(--text-secondary)]" />
          <span className="text-sm text-[var(--text-secondary)]">
            Upload de documentos em breve
          </span>
        </div>
      </div>
    </div>
  )
}
