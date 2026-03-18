import { z } from 'zod'

const taskStatusSchema = z.enum(['pending', 'in_progress', 'completed'])
const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio'),
  description: z.string().min(1, 'Descricao e obrigatoria'),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string().min(1, 'Data de vencimento e obrigatoria'),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').optional(),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: z.string().optional(),
})
