'use client'

import { useEffect } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createContactSchema } from '@/schemas'
import { useCreateContact, useUpdateContact } from '@/hooks/useContacts'
import type { Contact } from '@/types'

export type ContactFormValues = z.infer<typeof createContactSchema>

const DEFAULT_VALUES: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  role: '',
}

function toFormValues(contact: Contact): ContactFormValues {
  return {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    role: contact.role,
  }
}

interface UseContactFormOptions {
  projectId: string
  contact?: Contact | null
  onSuccess?: () => void
}

interface UseContactFormResult {
  form: UseFormReturn<ContactFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  isEditing: boolean
}

export function useContactForm({
  projectId,
  contact,
  onSuccess,
}: UseContactFormOptions): UseContactFormResult {
  const isEditing = !!contact

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: contact ? toFormValues(contact) : DEFAULT_VALUES,
  })

  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()

  useEffect(() => {
    form.reset(contact ? toFormValues(contact) : DEFAULT_VALUES)
  }, [contact, form])

  const onSubmit = form.handleSubmit((values) => {
    if (isEditing && contact) {
      updateMutation.mutate(
        { id: contact.id, input: values },
        {
          onSuccess: () => {
            form.reset(DEFAULT_VALUES)
            onSuccess?.()
          },
        },
      )
    } else {
      createMutation.mutate(
        { ...values, projectId },
        {
          onSuccess: () => {
            form.reset(DEFAULT_VALUES)
            onSuccess?.()
          },
        },
      )
    }
  })

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditing,
  }
}
