export interface StatCard {
  id: string
  title: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  icon: string
}

export interface DashboardOverview {
  stats: StatCard[]
}
