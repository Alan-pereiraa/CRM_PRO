'use client'

import { useState, useEffect, useCallback } from 'react'
import { createContactSchema } from '@/schemas'
import { contactService } from '@/services'
import type { Contact, CreateContactInput } from '@/types'

type ContactFormValues = Omit<CreateContactInput, 'projectId'>

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  role: '',
}

function contactToFormValues(contact: Contact): ContactFormValues {
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

export function useContactForm({ projectId, contact, onSuccess }: UseContactFormOptions) {
  const isEditing = contact !== null && contact !== undefined
  const [values, setValues] = useState<ContactFormValues>(
    contact ? contactToFormValues(contact) : INITIAL_VALUES,
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setValues(contact ? contactToFormValues(contact) : INITIAL_VALUES)
    setErrors({})
  }, [contact])

  const setValue = useCallback(
    <K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => {
        if (!prev[field]) return prev
        const next = { ...prev }
        delete next[field]
        return next
      })
    },
    [],
  )

  const reset = useCallback(() => {
    setValues(contact ? contactToFormValues(contact) : INITIAL_VALUES)
    setErrors({})
  }, [contact])

  const validate = useCallback((): boolean => {
    const result = createContactSchema.safeParse(values)
    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ContactFormValues
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    setErrors(fieldErrors)
    return false
  }, [values])

  const submit = useCallback(async () => {
    if (!validate()) return
    setLoading(true)
    try {
      if (isEditing && contact) {
        await contactService.update(contact.id, values)
      } else {
        await contactService.create({ ...values, projectId })
      }
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }, [validate, values, isEditing, contact, projectId, onSuccess])

  return { values, errors, loading, isEditing, setValue, reset, submit }
}

export type { ContactFormValues }
