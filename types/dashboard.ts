export interface StatCard {
  id: string
  title: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  icon: string
}

export interface FunnelStage {
  id: string
  name: string
  value: number
}

export interface FunnelData {
  stages: FunnelStage[]
  growthPercent: number
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: TaskPriority
  dueDate: string
  projectId: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface TodayTasks {
  tasks: Task[]
  pendingCount: number
}

export interface DashboardOverview {
  stats: StatCard[]
  funnel: FunnelData
  todayTasks: TodayTasks
}
