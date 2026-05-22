"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ContactFormValues } from "@/hooks/forms/useContactForm"

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>
}

export function ContactFormFields({ form }: ContactFormFieldsProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="contact-name" className="text-sm font-medium text-[var(--text-primary)]">
          Nome
        </Label>
        <Input
          id="contact-name"
          placeholder="Nome do contato"
          aria-invalid={!!errors.name}
          className="h-10"
          {...register("name")}
        />
        {errors.name?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.name.message}</p>
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
          aria-invalid={!!errors.email}
          className="h-10"
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone" className="text-sm font-medium text-[var(--text-primary)]">
          Telefone
        </Label>
        <Input
          id="contact-phone"
          placeholder="(11) 99999-9999"
          aria-invalid={!!errors.phone}
          className="h-10"
          {...register("phone")}
        />
        {errors.phone?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-role" className="text-sm font-medium text-[var(--text-primary)]">
          Cargo
        </Label>
        <Input
          id="contact-role"
          placeholder="Ex: Gerente comercial"
          aria-invalid={!!errors.role}
          className="h-10"
          {...register("role")}
        />
        {errors.role?.message && (
          <p className="text-xs text-[var(--text-danger)]">{errors.role.message}</p>
        )}
      </div>
    </div>
  )
}
