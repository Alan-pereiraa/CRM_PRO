import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('h-2 w-full rounded-full bg-gray-200 dark:bg-muted', className)}>
      <div
        className="h-full rounded-full bg-[var(--background-graphic)] transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
