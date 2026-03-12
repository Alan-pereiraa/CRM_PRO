import { z } from 'zod'

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Titulo e obrigatorio'),
  completed: z.boolean(),
  projectId: z.string(),
  createdAt: z.string(),
  position: z.number().int().min(0),
})

export const createSubtaskSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio'),
  projectId: z.string(),
})
