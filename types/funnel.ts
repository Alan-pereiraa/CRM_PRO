import type { Project } from './project'

export interface Funnel {
  id: string
  name: string
  position: number
  color: string
  accountId: string
}

export interface FunnelWithProjects extends Funnel {
  projects: Project[]
}

export type FunnelViewMode = 'kanban' | 'list'
