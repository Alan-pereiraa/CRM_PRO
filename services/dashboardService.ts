import type { DashboardOverview } from "@/types"
import { useTaskStore } from "@/stores"
import { delay } from "@/lib/utils"

const mockStats = [
  {
    id: "stat-1",
    title: "Receita do Mês",
    value: "R$ 45.200",
    trend: "+12.5% em relação ao mês passado",
    trendDirection: "up" as const,
    icon: "wallet",
  },
  {
    id: "stat-2",
    title: "Projetos Ativos",
    value: "24",
    trend: "+2 novos hoje",
    trendDirection: "up" as const,
    icon: "clipboard",
  },
  {
    id: "stat-3",
    title: "Leads Novos",
    value: "18",
    trend: "+5 esta semana",
    trendDirection: "up" as const,
    icon: "user-plus",
  },
]

const mockFunnel = {
  stages: [
    { id: "stage-1", name: "Lead", value: 18 },
    { id: "stage-2", name: "Qualificação", value: 12 },
    { id: "stage-3", name: "Proposta", value: 7 },
    { id: "stage-4", name: "Negociação", value: 10 },
    { id: "stage-5", name: "Fechamento", value: 5 },
  ],
  growthPercent: 12,
}

export const dashboardService = {
  async getOverview(accountId: string): Promise<DashboardOverview> {
    await delay()
    const tasks = useTaskStore.getState().getToday(accountId)
    return {
      stats: mockStats,
      funnel: mockFunnel,
      todayTasks: {
        tasks,
        pendingCount: tasks.filter((t) => t.status !== 'completed').length,
      },
    }
  },
}
