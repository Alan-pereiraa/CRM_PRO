import type { TaskPriority } from '@/types'

export interface TaskSeed {
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: TaskPriority
  projectIndex: number
  dueTime: string
  createdDaysAgo?: number
}

export const defaultTasks: TaskSeed[] = [
  { title: 'Enviar proposta para o cliente', description: 'Preparar e enviar proposta comercial detalhada', status: 'pending', priority: 'urgent', projectIndex: 0, dueTime: '14:00:00Z', createdDaysAgo: 10 },
  { title: 'Criar wireframes das páginas', description: 'Desenhar wireframes de todas as páginas principais', status: 'completed', priority: 'high', projectIndex: 0, dueTime: '10:00:00Z', createdDaysAgo: 15 },
  { title: 'Configurar ambiente de desenvolvimento', description: 'Setup do projeto com Next.js e deploy', status: 'completed', priority: 'medium', projectIndex: 0, dueTime: '09:00:00Z', createdDaysAgo: 20 },

  { title: 'Reunião de alinhamento', description: 'Alinhar requisitos e expectativas com o cliente', status: 'pending', priority: 'high', projectIndex: 1, dueTime: '15:30:00Z', createdDaysAgo: 5 },
  { title: 'Definir arquitetura do app', description: 'Escolher stack e definir arquitetura', status: 'in_progress', priority: 'urgent', projectIndex: 1, dueTime: '11:00:00Z', createdDaysAgo: 12 },
  { title: 'Prototipar telas principais', description: 'Criar protótipo no Figma', status: 'completed', priority: 'high', projectIndex: 1, dueTime: '16:00:00Z', createdDaysAgo: 18 },

  { title: 'Revisar contrato', description: 'Revisar termos e condições do contrato do projeto', status: 'completed', priority: 'medium', projectIndex: 2, dueTime: '17:00:00Z', createdDaysAgo: 8 },
  { title: 'Integrar gateway de pagamento', description: 'Implementar integração com Stripe', status: 'pending', priority: 'urgent', projectIndex: 2, dueTime: '14:00:00Z', createdDaysAgo: 3 },

  { title: 'Atualizar status do projeto', description: 'Atualizar progresso e métricas no painel de controle', status: 'pending', priority: 'low', projectIndex: 3, dueTime: '18:00:00Z', createdDaysAgo: 2 },
  { title: 'Implementar gráficos de vendas', description: 'Criar visualizações com Recharts', status: 'in_progress', priority: 'medium', projectIndex: 3, dueTime: '13:00:00Z', createdDaysAgo: 7 },

  { title: 'Levantar requisitos visuais', description: 'Definir paleta de cores e tipografia', status: 'completed', priority: 'low', projectIndex: 4, dueTime: '10:00:00Z', createdDaysAgo: 25 },

  { title: 'Criar copy da landing page', description: 'Escrever textos persuasivos para a página', status: 'in_progress', priority: 'medium', projectIndex: 5, dueTime: '15:00:00Z', createdDaysAgo: 4 },
]
