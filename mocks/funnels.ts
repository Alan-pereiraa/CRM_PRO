import type { Funnel } from '@/types'

export const mockFunnels: Funnel[] = [
  {
    id: 'funnel-1',
    name: 'Lead',
    position: 0,
    color: '#3B82F6',
    accountId: 'user-1',
  },
  {
    id: 'funnel-2',
    name: 'Contato',
    position: 1,
    color: '#8B5CF6',
    accountId: 'user-1',
  },
  {
    id: 'funnel-3',
    name: 'Proposta',
    position: 2,
    color: '#F59E0B',
    accountId: 'user-1',
  },
  {
    id: 'funnel-4',
    name: 'Negociacao',
    position: 3,
    color: '#EF4444',
    accountId: 'user-1',
  },
  {
    id: 'funnel-5',
    name: 'Fechado',
    position: 4,
    color: '#10B981',
    accountId: 'user-1',
  },
]
