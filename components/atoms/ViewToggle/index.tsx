"use client"

import { Kanban, List } from "lucide-react"
import type { FunnelViewMode } from "@/types"

interface ViewToggleProps {
  view: FunnelViewMode
  onViewChange: (view: FunnelViewMode) => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const activeStyles = "bg-[#F1F5F9] text-[var(--text-primary)]"
  const inactiveStyles =
    "text-[var(--text-gray-light)] hover:text-[var(--text-secondary)]"

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white p-1">
      <button
        onClick={() => onViewChange("kanban")}
        className={`flex h-7 w-8 items-center justify-center rounded-md transition-colors ${
          view === "kanban" ? activeStyles : inactiveStyles
        }`}
        aria-label="Visualização Kanban"
        aria-pressed={view === "kanban"}
      >
        <Kanban size={16} />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`flex h-7 w-8 items-center justify-center rounded-md transition-colors ${
          view === "list" ? activeStyles : inactiveStyles
        }`}
        aria-label="Visualização Lista"
        aria-pressed={view === "list"}
      >
        <List size={16} />
      </button>
    </div>
  )
}
