"use client"

import { useState, useCallback } from "react"
import { createProjectSchema } from "@/schemas"
import { projectService } from "@/services"
import { useAuth } from "@/hooks/useAuth"
import type { CreateProjectInput, Project } from "@/types"

type FieldErrors = Partial<Record<keyof CreateProjectInput, string>>

const INITIAL_VALUES: CreateProjectInput = {
  title: "",
  description: "",
  status: "active",
  priority: "medium",
  value: 0,
  funnelId: "",
  deadline: "",
}

export function useProjectForm(onSuccess?: (project: Project) => void) {
  const { user } = useAuth()
  const [values, setValues] = useState<CreateProjectInput>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const setValue = useCallback(
    <K extends keyof CreateProjectInput>(field: K, value: CreateProjectInput[K]) => {
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
    setValues(INITIAL_VALUES)
    setErrors({})
  }, [])

  const validate = useCallback((): boolean => {
    const result = createProjectSchema.safeParse(values)
    if (result.success) {
      setErrors({})
      return true
    }
    const fieldErrors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof CreateProjectInput
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    setErrors(fieldErrors)
    return false
  }, [values])

  const submit = useCallback(async () => {
    if (!validate() || !user) return
    setLoading(true)
    try {
      const project = await projectService.create(values, user.id)
      reset()
      onSuccess?.(project)
    } finally {
      setLoading(false)
    }
  }, [validate, values, user, reset, onSuccess])

  return { values, errors, loading, setValue, reset, submit }
}
