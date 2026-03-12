export type ProjectStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  value: number
  funnelId: string
  accountId: string
  deadline: string
  createdAt: string
  updatedAt: string
  position: number
}

export interface CreateProjectInput {
  title: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  value: number
  funnelId: string
  deadline: string
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  value?: number
  funnelId?: string
  deadline?: string
}
