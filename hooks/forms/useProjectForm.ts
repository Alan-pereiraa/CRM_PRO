'use client'

import { useEffect } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createProjectSchema } from '@/schemas'
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects'
import type { Project } from '@/types'

export type ProjectFormValues = z.infer<typeof createProjectSchema>

const DEFAULT_VALUES: ProjectFormValues = {
  title: '',
  description: '',
  status: 'active',
  priority: 'medium',
  value: 0,
  funnelId: '',
  deadline: '',
}

function toFormValues(project: Project): ProjectFormValues {
  return {
    title: project.title,
    description: project.description,
    status: project.status,
    priority: project.priority,
    value: project.value,
    funnelId: project.funnelId,
    deadline: project.deadline ? project.deadline.split('T')[0] : '',
  }
}

interface UseProjectFormOptions {
  project?: Project | null
  onSuccess?: (project: Project) => void
}

interface UseProjectFormResult {
  form: UseFormReturn<ProjectFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  isEditing: boolean
}

export function useProjectForm({
  project,
  onSuccess,
}: UseProjectFormOptions = {}): UseProjectFormResult {
  const isEditing = !!project

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: project ? toFormValues(project) : DEFAULT_VALUES,
  })

  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()

  useEffect(() => {
    form.reset(project ? toFormValues(project) : DEFAULT_VALUES)
  }, [project, form])

  const onSubmit = form.handleSubmit((values) => {
    if (isEditing && project) {
      updateMutation.mutate(
        { id: project.id, input: values },
        {
          onSuccess: (updated) => {
            form.reset(DEFAULT_VALUES)
            onSuccess?.(updated)
          },
        },
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: (created) => {
          form.reset(DEFAULT_VALUES)
          onSuccess?.(created)
        },
      })
    }
  })

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditing,
  }
}
