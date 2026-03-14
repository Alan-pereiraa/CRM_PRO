import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function delay(ms: number = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
