import type { DashboardOverview } from "@/types"

const mockOverview: DashboardOverview = {
  stats: [
    {
      id: "stat-1",
      title: "Receita do Mês",
      value: "R$ 45.200",
      trend: "+12.5% em relação ao mês passado",
      trendDirection: "up",
      icon: "wallet",
    },
    {
      id: "stat-2",
      title: "Projetos Ativos",
      value: "24",
      trend: "+2 novos hoje",
      trendDirection: "up",
      icon: "clipboard",
    },
    {
      id: "stat-3",
      title: "Leads Novos",
      value: "18",
      trend: "+5 esta semana",
      trendDirection: "up",
      icon: "user-plus",
    },
  ],
}

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return mockOverview
  },
}
