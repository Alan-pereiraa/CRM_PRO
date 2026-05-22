import type { Task } from '@/types'

export interface ProjectStats {
  progress: number
  activeTasks: number
  totalTasks: number
  tasksDueThisWeek: number
  trackedTimeMinutes: number
}

export const EMPTY_PROJECT_STATS: ProjectStats = {
  progress: 0,
  activeTasks: 0,
  totalTasks: 0,
  tasksDueThisWeek: 0,
  trackedTimeMinutes: 0,
}

export function computeProjectStats(tasks: Task[]): ProjectStats {
  if (tasks.length === 0) return EMPTY_PROJECT_STATS

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

  return {
    progress,
    activeTasks,
    totalTasks: tasks.length,
    tasksDueThisWeek,
    trackedTimeMinutes,
  }
}
