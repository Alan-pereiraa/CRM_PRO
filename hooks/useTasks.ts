'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { taskService } from '@/services/taskService'
import { useCurrentUser } from './useCurrentUser'
import {
  dashboardKeys,
  projectKeys,
  taskKeys,
} from './queryKeys'
import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/types'

function toastError(fallback: string) {
  return (err: unknown) => {
    toast.error(err instanceof Error ? err.message : fallback)
  }
}

export function useTasks(status?: TaskStatus) {
  const { data: user } = useCurrentUser()
  return useQuery({
    queryKey: taskKeys.list({ status }),
    queryFn: ({ signal }) => taskService.getAll(status, { signal }),
    enabled: !!user,
  })
}

export function useTodayTasks() {
  const { data: user } = useCurrentUser()
  return useQuery({
    queryKey: taskKeys.today(),
    queryFn: ({ signal }) => taskService.getToday({ signal }),
    enabled: !!user,
  })
}

export function useTask(id: string) {
  const { data: user } = useCurrentUser()
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: ({ signal }) => taskService.getById(id, { signal }),
    enabled: !!user && !!id,
  })
}

function invalidateTaskScopes(qc: ReturnType<typeof useQueryClient>, projectId?: string) {
  qc.invalidateQueries({ queryKey: taskKeys.all })
  qc.invalidateQueries({ queryKey: dashboardKeys.all })
  if (projectId) qc.invalidateQueries({ queryKey: projectKeys.full(projectId) })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.create(input),
    onSuccess: (task: Task) => invalidateTaskScopes(qc, task.projectId),
    onError: toastError('Erro ao criar tarefa'),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      taskService.update(id, input),
    onSuccess: (task: Task) => invalidateTaskScopes(qc, task.projectId),
    onError: toastError('Erro ao atualizar tarefa'),
  })
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateStatus(id, status),
    onSuccess: (task: Task) => invalidateTaskScopes(qc, task.projectId),
    onError: toastError('Erro ao atualizar status da tarefa'),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId?: string }) => taskService.delete(id),
    onSuccess: (_, { projectId }) => invalidateTaskScopes(qc, projectId),
    onError: toastError('Erro ao excluir tarefa'),
  })
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
