import { z } from 'zod'

const projectStatusSchema = z.enum(['active', 'completed', 'paused', 'cancelled'])
const projectPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Titulo e obrigatorio'),
  description: z.string(),
  status: projectStatusSchema,
  priority: projectPrioritySchema,
  value: z.number().min(0, 'Valor deve ser positivo'),
  funnelId: z.string(),
  accountId: z.string(),
  deadline: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  position: z.number().int().min(0),
})

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio'),
  description: z.string().min(1, 'Descricao e obrigatoria'),
  status: projectStatusSchema,
  priority: projectPrioritySchema,
  value: z.number().min(0, 'Valor deve ser positivo'),
  funnelId: z.string().min(1, 'Funil e obrigatorio'),
  deadline: z.string().min(1, 'Prazo e obrigatorio'),
})

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').optional(),
  description: z.string().optional(),
  status: projectStatusSchema.optional(),
  priority: projectPrioritySchema.optional(),
  value: z.number().min(0, 'Valor deve ser positivo').optional(),
  funnelId: z.string().optional(),
  deadline: z.string().optional(),
})
