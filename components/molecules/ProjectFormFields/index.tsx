"use client"

import { NumericFormat } from "react-number-format"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { Funnel, CreateProjectInput, ProjectStatus, ProjectPriority } from "@/types"

interface ProjectFormFieldsProps {
  values: CreateProjectInput
  errors: Partial<Record<keyof CreateProjectInput, string>>
  funnels: Funnel[]
  onValueChange: <K extends keyof CreateProjectInput>(
    field: K,
    value: CreateProjectInput[K],
  ) => void
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Ativo" },
  { value: "completed", label: "Concluído" },
  { value: "paused", label: "Pausado" },
  { value: "cancelled", label: "Cancelado" },
]

const PRIORITY_OPTIONS: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
]

const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label]),
) as Record<ProjectStatus, string>

const PRIORITY_LABELS = Object.fromEntries(
  PRIORITY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<ProjectPriority, string>

export function ProjectFormFields({
  values,
  errors,
  funnels,
  onValueChange,
}: ProjectFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="project-title" className="text-sm font-medium text-[var(--text-primary)]">
          Título
        </Label>
        <Input
          id="project-title"
          placeholder="Nome do projeto"
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
        <Label htmlFor="project-description" className="text-sm font-medium text-[var(--text-primary)]">
          Descrição
        </Label>
        <Textarea
          id="project-description"
          placeholder="Descreva o projeto..."
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
        <Label className="text-sm font-medium text-[var(--text-primary)]">
          Funil
        </Label>
        <Select
          value={values.funnelId}
          onValueChange={(val) => onValueChange("funnelId", val as string)}
        >
          <SelectTrigger className="h-10 w-full min-w-0" aria-invalid={!!errors.funnelId}>
            <span className="flex flex-1 items-center gap-1.5 text-left">
              {values.funnelId
                ? funnels.find((f) => f.id === values.funnelId)?.name
                : <span className="text-muted-foreground">Selecione o funil</span>}
            </span>
          </SelectTrigger>
          <SelectContent>
            {funnels.map((funnel) => (
              <SelectItem key={funnel.id} value={funnel.id} label={funnel.name}>
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: funnel.color }}
                  />
                  {funnel.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.funnelId && (
          <p className="text-xs text-[var(--text-danger)]">{errors.funnelId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label htmlFor="project-value" className="text-sm font-medium text-[var(--text-primary)]">
            Valor (R$)
          </Label>
          <NumericFormat
            id="project-value"
            customInput={Input}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            prefix="R$ "
            placeholder="R$ 0,00"
            value={values.value || ""}
            onValueChange={(v) => onValueChange("value", v.floatValue ?? 0)}
            aria-invalid={!!errors.value}
            className="h-10 w-full"
          />
          {errors.value && (
            <p className="text-xs text-[var(--text-danger)]">{errors.value}</p>
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <Label htmlFor="project-deadline" className="text-sm font-medium text-[var(--text-primary)]">
            Prazo
          </Label>
          <Input
            id="project-deadline"
            type="date"
            value={values.deadline}
            onChange={(e) => onValueChange("deadline", e.target.value)}
            aria-invalid={!!errors.deadline}
            className="h-10 w-full"
          />
          {errors.deadline && (
            <p className="text-xs text-[var(--text-danger)]">{errors.deadline}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-medium text-[var(--text-primary)]">
            Status
          </Label>
          <Select
            value={values.status}
            onValueChange={(val) => onValueChange("status", val as ProjectStatus)}
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
            onValueChange={(val) => onValueChange("priority", val as ProjectPriority)}
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
    </div>
  )
}
