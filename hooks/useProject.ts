'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectSchema } from '@/schemas'
import { projectService } from '@/services'
import {
  useProjectStore,
  useTaskStore,
  useContactStore,
  useModuleLoading,
  useModuleError,
} from '@/stores'
import type { Project, Task, Contact, Funnel, CreateProjectInput } from '@/types'

export interface ProjectStats {
  progress: number
  activeTasks: number
  totalTasks: number
  tasksDueThisWeek: number
  trackedTimeMinutes: number
}

interface UseProjectReturn {
  project: Project | null
  tasks: Task[]
  contacts: Contact[]
  funnel: Funnel | null
  stats: ProjectStats
  loading: boolean
  error: string | null
  deleteProject: () => Promise<void>
  refetch: () => Promise<void>
}

const EMPTY_STATS: ProjectStats = {
  progress: 0,
  activeTasks: 0,
  totalTasks: 0,
  tasksDueThisWeek: 0,
  trackedTimeMinutes: 0,
}

type FieldErrors = Partial<Record<keyof CreateProjectInput, string>>

const INITIAL_VALUES: CreateProjectInput = {
  title: '',
  description: '',
  status: 'active',
  priority: 'medium',
  value: 0,
  funnelId: '',
  deadline: '',
}

export function useProject(projectId: string): UseProjectReturn {
  const projectFromStore = useProjectStore((s) =>
    s.projects.find((p) => p.id === projectId) ?? null,
  )
  const allTasks = useTaskStore((s) => s.tasks)
  const allContacts = useContactStore((s) => s.contacts)
  const loading = useModuleLoading('project')
  const error = useModuleError('project')
  const router = useRouter()

  const [funnel, setFunnel] = useState<Funnel | null>(null)

  const tasks = useMemo(
    () => allTasks.filter((t) => t.projectId === projectId),
    [allTasks, projectId],
  )

  const contacts = useMemo(
    () => allContacts.filter((c) => c.projectId === projectId),
    [allContacts, projectId],
  )

  const refetch = useCallback(async () => {
    const details = await projectService.getDetails(projectId)
    setFunnel(details.funnel)
  }, [projectId])

  useEffect(() => {
    refetch().catch(() => {
    })
  }, [refetch])

  const stats: ProjectStats = useMemo(() => {
    if (tasks.length === 0) return EMPTY_STATS

    const completed = tasks.filter((t) => t.status === 'completed').length
    const activeTasks = tasks.length - completed
    const progress = Math.round((completed / tasks.length) * 100)

    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()))

    const tasksDueThisWeek = tasks.filter((t) => {
      if (t.status === 'completed') return false
      const due = new Date(t.dueDate)
      return due <= endOfWeek
    }).length

    const trackedTimeMinutes = tasks.reduce((total, task) => {
      const start = new Date(task.createdAt).getTime()
      const end = task.completedAt
        ? new Date(task.completedAt).getTime()
        : Date.now()
      return total + Math.max(0, (end - start) / 60_000)
    }, 0)

    return { progress, activeTasks, totalTasks: tasks.length, tasksDueThisWeek, trackedTimeMinutes }
  }, [tasks])

  const deleteProject = useCallback(async () => {
    await projectService.delete(projectId)
    router.push('/funnel')
  }, [projectId, router])

  return { project: projectFromStore, tasks, contacts, funnel, stats, loading, error, deleteProject, refetch }
}

export function useProjectForm(onSuccess?: (project: Project) => void) {
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
    if (!validate()) return
    setLoading(true)
    try {
      let project: Project
      if (editingId) {
        project = await projectService.update(editingId, values)
      } else {
        project = await projectService.create(values)
      }
      reset()
      onSuccess?.(project)
    } finally {
      setLoading(false)
    }
  }, [validate, values, editingId, reset, onSuccess])

  return { values, errors, loading, isEditing, setValue, reset, loadProject, submit }
}
