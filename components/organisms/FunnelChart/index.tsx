"use client"

import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { TooltipContentProps } from "recharts"
import { useTheme } from "next-themes"
import type { FunnelData, FunnelStage } from "@/types"

function CustomTooltip({ active, payload }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null
  const stage = payload[0].payload as FunnelStage

  return (
    <div className="rounded-lg border border-[#F1F5F9] dark:border-border bg-white dark:bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-[var(--text-primary)]">{stage.name}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {stage.value} projetos
      </p>
    </div>
  )
}

interface FunnelChartProps {
  data: FunnelData
}

export function FunnelChart({ data }: FunnelChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const barFill = mounted && resolvedTheme === "dark" ? "#64748B" : "#D8DEE8"

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#F1F5F9] dark:border-border bg-[#F8FAFC] dark:bg-muted p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Funil de Vendas
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Projetos por etapa do funil
          </p>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
          <TrendingUp size={12} />
          +{data.growthPercent}%
        </span>
      </div>

      <div className="mt-6 min-h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.stages}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {data.stages.map((stage) => (
                <Cell key={stage.id} fill={barFill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
