import type { Task } from '@/types'

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Enviar proposta para cliente ABC',
    subtitle: 'Projeto Web — 14:00',
    time: '14:00',
    done: false,
    priority: 'urgent',
  },
  {
    id: 'task-2',
    title: 'Reunião de alinhamento',
    subtitle: 'Equipe Design — 15:30',
    time: '15:30',
    done: false,
    priority: 'high',
  },
  {
    id: 'task-3',
    title: 'Revisar contrato freelancer',
    subtitle: 'Jurídico — 17:00',
    time: '17:00',
    done: true,
    priority: 'medium',
  },
  {
    id: 'task-4',
    title: 'Atualizar status do projeto',
    subtitle: 'CRM Interno — 18:00',
    time: '18:00',
    done: false,
    priority: 'low',
  },
]
