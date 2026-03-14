export interface FunnelSeed {
  name: string
  position: number
  color: string
}

export const defaultFunnels: FunnelSeed[] = [
  { name: 'Lead', position: 0, color: '#3B82F6' },
  { name: 'Contato', position: 1, color: '#8B5CF6' },
  { name: 'Proposta', position: 2, color: '#F59E0B' },
  { name: 'Negociacao', position: 3, color: '#EF4444' },
  { name: 'Fechado', position: 4, color: '#10B981' },
]
