import type { TaskPriority } from '@/types'

export interface TaskSeed {
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: TaskPriority
  projectIndex: number
  dueTime: string
}

export const defaultTasks: TaskSeed[] = [
  { title: 'Enviar proposta para o cliente', description: 'Preparar e enviar proposta comercial detalhada', status: 'pending', priority: 'urgent', projectIndex: 0, dueTime: '14:00:00Z' },
  { title: 'Reunião de alinhamento', description: 'Alinhar requisitos e expectativas com o cliente', status: 'pending', priority: 'high', projectIndex: 1, dueTime: '15:30:00Z' },
  { title: 'Revisar contrato', description: 'Revisar termos e condições do contrato do projeto', status: 'completed', priority: 'medium', projectIndex: 2, dueTime: '17:00:00Z' },
  { title: 'Atualizar status do projeto', description: 'Atualizar progresso e métricas no painel de controle', status: 'pending', priority: 'low', projectIndex: 3, dueTime: '18:00:00Z' },
]
