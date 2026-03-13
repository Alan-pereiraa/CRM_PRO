import {
  Wallet,
  ClipboardList,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { StatCard as StatCardType } from "@/types"

interface StatCardProps {
  stat: StatCardType
}

const iconMap: Record<string, React.ReactNode> = {
  wallet: <Wallet size={20} />,
  clipboard: <ClipboardList size={20} />,
  "user-plus": <UserPlus size={20} />,
}

export function StatCard({ stat }: StatCardProps) {
  const isUp = stat.trendDirection === "up"

  return (
    <div className="rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {stat.title}
        </span>
        <span className="text-[var(--text-gray-light)]">
          {iconMap[stat.icon]}
        </span>
      </div>

      <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
        {stat.value}
      </p>

      <div className="mt-3 flex items-center gap-1.5">
        {isUp ? (
          <TrendingUp size={14} className="text-[var(--text-green)]" />
        ) : (
          <TrendingDown size={14} className="text-[var(--text-danger)]" />
        )}
        <span
          className={`text-xs font-medium ${
            isUp ? "text-[var(--text-green)]" : "text-[var(--text-danger)]"
          }`}
        >
          {stat.trend}
        </span>
      </div>
    </div>
  )
}
