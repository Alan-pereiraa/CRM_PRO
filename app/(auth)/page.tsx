"use client"

import { StatCard } from "@/components/molecules/StatCard"
import { DashboardSkeleton } from "@/components/molecules/DashboardSkeleton"
import { FunnelChart } from "@/components/organisms/FunnelChart"
import { TodayTasks } from "@/components/organisms/TodayTasks"
import { useDashboard } from "@/hooks/useDashboard"

export default function DashboardPage() {
  const { data, loading, toggleTask } = useDashboard()

  if (loading) return <DashboardSkeleton />
  if (!data) return null

  return (
    <div className="flex flex-1 flex-col p-6 lg:p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Visão Geral
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Bem-vindo de volta! Aqui está o seu resumo de hoje.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:mt-6 lg:grid-cols-3">
        <div className="min-h-[360px] lg:col-span-2">
          <FunnelChart data={data.funnel} />
        </div>
        <div className="min-h-[360px] lg:col-span-1">
          <TodayTasks data={data.todayTasks} onToggle={toggleTask} />
        </div>
      </div>
    </div>
  )
}
