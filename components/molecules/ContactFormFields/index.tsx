"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ContactFormValues } from "@/hooks/useContact"

interface ContactFormFieldsProps {
  values: ContactFormValues
  errors: Partial<Record<keyof ContactFormValues, string>>
  onValueChange: <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) => void
}

export function ContactFormFields({ values, errors, onValueChange }: ContactFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="contact-name" className="text-sm font-medium text-[var(--text-primary)]">
          Nome
        </Label>
        <Input
          id="contact-name"
          placeholder="Nome do contato"
          value={values.name}
          onChange={(e) => onValueChange("name", e.target.value)}
          aria-invalid={!!errors.name}
          className="h-10"
        />
        {errors.name && (
          <p className="text-xs text-[var(--text-danger)]">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email" className="text-sm font-medium text-[var(--text-primary)]">
          E-mail
        </Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="email@empresa.com"
          value={values.email}
          onChange={(e) => onValueChange("email", e.target.value)}
          aria-invalid={!!errors.email}
          className="h-10"
        />
        {errors.email && (
          <p className="text-xs text-[var(--text-danger)]">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone" className="text-sm font-medium text-[var(--text-primary)]">
          Telefone
        </Label>
        <Input
          id="contact-phone"
          placeholder="(11) 99999-9999"
          value={values.phone}
          onChange={(e) => onValueChange("phone", e.target.value)}
          aria-invalid={!!errors.phone}
          className="h-10"
        />
        {errors.phone && (
          <p className="text-xs text-[var(--text-danger)]">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-role" className="text-sm font-medium text-[var(--text-primary)]">
          Cargo
        </Label>
        <Input
          id="contact-role"
          placeholder="Ex: Gerente comercial"
          value={values.role}
          onChange={(e) => onValueChange("role", e.target.value)}
          aria-invalid={!!errors.role}
          className="h-10"
        />
        {errors.role && (
          <p className="text-xs text-[var(--text-danger)]">{errors.role}</p>
        )}
      </div>
    </div>
  )
}
