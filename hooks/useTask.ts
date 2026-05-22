'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createTaskSchema } from '@/schemas'
import { taskService } from '@/services'
import type { Task, TaskStatus, TaskPriority, CreateTaskInput } from '@/types'

type TaskFormValues = Omit<CreateTaskInput, 'projectId'>

type FieldErrors = Partial<Record<keyof TaskFormValues, string>>

const INITIAL_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
}

function taskToFormValues(task: Task): TaskFormValues {
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

export function useTaskForm({ projectId, task, onSuccess }: UseTaskFormOptions) {
  const isEditing = task !== null && task !== undefined
  const [values, setValues] = useState<TaskFormValues>(
    task ? taskToFormValues(task) : INITIAL_VALUES,
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setValues(task ? taskToFormValues(task) : INITIAL_VALUES)
    setErrors({})
  }, [task])

  const setValue = useCallback(
    <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
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
    setValues(task ? taskToFormValues(task) : INITIAL_VALUES)
    setErrors({})
  }, [task])

  const validate = useCallback((): boolean => {
    const result = createTaskSchema.safeParse(values)
    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof TaskFormValues
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
      if (isEditing && task) {
        await taskService.update(task.id, values)
      } else {
        await taskService.create({ ...values, projectId })
      }
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }, [validate, values, isEditing, task, projectId, onSuccess])

  return { values, errors, loading, isEditing, setValue, reset, submit }
}

const PAGE_SIZE = 6

export function useTasksTable(tasks: Task[]) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = tasks

    if (search) {
      const lower = search.toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(lower))
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter)
    }

    return result
  }, [tasks, search, statusFilter, priorityFilter])

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, safePage])

  const setSearchFilter = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const setStatusFilterValue = useCallback((value: TaskStatus | 'all') => {
    setStatusFilter(value)
    setPage(1)
  }, [])

  const setPriorityFilterValue = useCallback((value: TaskPriority | 'all') => {
    setPriorityFilter(value)
    setPage(1)
  }, [])

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1))
  }, [])

  return {
    tasks: paginated,
    totalCount,
    page: safePage,
    totalPages,
    nextPage,
    prevPage,
    filters: { search, status: statusFilter, priority: priorityFilter },
    setSearch: setSearchFilter,
    setStatusFilter: setStatusFilterValue,
    setPriorityFilter: setPriorityFilterValue,
  }
}
