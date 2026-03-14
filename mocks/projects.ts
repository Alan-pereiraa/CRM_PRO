import type { ProjectStatus, ProjectPriority } from '@/types'

export interface ProjectSeed {
  title: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  value: number
  funnelIndex: number
  deadline: string
}

export const defaultProjects: ProjectSeed[] = [
  { title: 'Website Corporativo', description: 'Desenvolvimento de site institucional com CMS', status: 'active', priority: 'high', value: 8500, funnelIndex: 0, deadline: '2025-04-15T00:00:00Z' },
  { title: 'App Mobile Delivery', description: 'Aplicativo de delivery para restaurante local', status: 'active', priority: 'urgent', value: 15000, funnelIndex: 1, deadline: '2025-05-01T00:00:00Z' },
  { title: 'E-commerce Moda', description: 'Loja virtual completa com integracoes de pagamento', status: 'active', priority: 'high', value: 12000, funnelIndex: 2, deadline: '2025-06-01T00:00:00Z' },
  { title: 'Dashboard Analytics', description: 'Painel de metricas para SaaS', status: 'active', priority: 'medium', value: 6000, funnelIndex: 0, deadline: '2025-04-30T00:00:00Z' },
  { title: 'Redesign Blog', description: 'Redesign completo de blog existente', status: 'completed', priority: 'low', value: 3500, funnelIndex: 4, deadline: '2025-03-01T00:00:00Z' },
  { title: 'Landing Page Startup', description: 'Landing page de alta conversao para lancamento de produto', status: 'active', priority: 'medium', value: 4000, funnelIndex: 3, deadline: '2025-05-15T00:00:00Z' },
  { title: 'Sistema de Agendamento', description: 'Plataforma de agendamento online para clinica', status: 'paused', priority: 'low', value: 7000, funnelIndex: 1, deadline: '2025-07-01T00:00:00Z' },
  { title: 'Portal do Aluno', description: 'Sistema web para gestao de cursos online', status: 'active', priority: 'high', value: 9500, funnelIndex: 2, deadline: '2025-06-15T00:00:00Z' },
]
