import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const past = new Date(dateString).getTime()
  const diffMs = now - past

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "agora"
  if (minutes < 60) return `${minutes} min atras`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? "hora" : "horas"} atras`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? "dia" : "dias"} atras`

  const months = Math.floor(days / 30)
  return `${months} ${months === 1 ? "mes" : "meses"} atras`
}

export function formatTrackedTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return value
}

export function formatDateLong(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
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
