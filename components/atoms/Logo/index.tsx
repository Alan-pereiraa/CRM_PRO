import { BarChart3 } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-graphic)]">
        <BarChart3 size={18} className="text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
        CRM <span className="text-[var(--text-secondary)]">PRO</span>
      </span>
    </div>
  )
}
