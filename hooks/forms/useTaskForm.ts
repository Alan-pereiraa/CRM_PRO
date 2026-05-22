'use client'

import { useEffect } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTaskSchema } from '@/schemas'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import type { Task } from '@/types'

export type TaskFormValues = z.infer<typeof createTaskSchema>

const DEFAULT_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
}

function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  }
}

interface UseTaskFormOptions {
  projectId: string
  task?: Task | null
  onSuccess?: () => void
}

interface UseTaskFormResult {
  form: UseFormReturn<TaskFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  isEditing: boolean
}

export function useTaskForm({
  projectId,
  task,
  onSuccess,
}: UseTaskFormOptions): UseTaskFormResult {
  const isEditing = !!task

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: task ? toFormValues(task) : DEFAULT_VALUES,
  })

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()

  useEffect(() => {
    form.reset(task ? toFormValues(task) : DEFAULT_VALUES)
  }, [task, form])

  const onSubmit = form.handleSubmit((values) => {
    if (isEditing && task) {
      updateMutation.mutate(
        { id: task.id, input: values },
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
