"use client"

import { StatCard } from "@/components/molecules/StatCard"
import { useDashboard } from "@/hooks/useDashboard"

export default function DashboardPage() {
  const { data, loading } = useDashboard()

  return (
    <div className="p-6 lg:p-8">
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
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[140px] animate-pulse rounded-2xl bg-[#F1F5F9]"
              />
            ))
          : data?.stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
      </div>
    </div>
  )
}
