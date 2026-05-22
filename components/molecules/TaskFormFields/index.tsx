"use client"

import { Controller, type UseFormReturn } from "react-hook-form"
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
import type { TaskFormValues } from "@/hooks/forms/useTaskForm"
import type { TaskStatus, TaskPriority } from "@/types"

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>
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

export function TaskFormFields({ form }: TaskFormFieldsProps) {
  const { register, control, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="task-title" className="text-sm font-medium text-[var(--text-primary)]">
          Título
        </Label>
        <Input
          id="task-title"
          placeholder="Nome da tarefa"
          aria-invalid={!!errors.title}
          className="h-10"
          {...register("title")}
        />
        {errors.title?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description" className="text-sm font-medium text-[var(--text-primary)]">
          Descrição
        </Label>
        <Textarea
          id="task-description"
          placeholder="Descreva a tarefa..."
          aria-invalid={!!errors.description}
          rows={3}
          className="resize-none"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-dueDate" className="text-sm font-medium text-[var(--text-primary)]">
          Data de Vencimento
        </Label>
        <Input
          id="task-dueDate"
          type="date"
          aria-invalid={!!errors.dueDate}
          className="h-10"
          {...register("dueDate")}
        />
        {errors.dueDate?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-medium text-[var(--text-primary)]">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10 w-full min-w-0">
                  <span className="flex flex-1 text-left">
                    {STATUS_LABELS[field.value]}
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
            )}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-medium text-[var(--text-primary)]">Prioridade</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10 w-full min-w-0">
                  <span className="flex flex-1 text-left">
                    {PRIORITY_LABELS[field.value]}
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
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-[var(--text-primary)]">Anexos</Label>
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
