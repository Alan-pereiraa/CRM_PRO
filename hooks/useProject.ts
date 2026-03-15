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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [values, setValues] = useState<CreateProjectInput>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const isEditing = editingId !== null

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
    setEditingId(null)
    setValues(INITIAL_VALUES)
    setErrors({})
  }, [])

  const loadProject = useCallback((project: Project) => {
    setEditingId(project.id)
    setValues({
      title: project.title,
      description: project.description,
      status: project.status,
      priority: project.priority,
      value: project.value,
      funnelId: project.funnelId,
      deadline: project.deadline,
    })
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
      let project: Project
      if (editingId) {
        project = await projectService.update(editingId, values)
      } else {
        project = await projectService.create(values, user.id)
      }
      reset()
      onSuccess?.(project)
    } finally {
      setLoading(false)
    }
  }, [validate, values, user, editingId, reset, onSuccess])

  return { values, errors, loading, isEditing, setValue, reset, loadProject, submit }
}
