import { z } from 'zod'

export const funnelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome e obrigatorio'),
  position: z.number().int().min(0),
  color: z.string(),
  accountId: z.string(),
})

export const createFunnelSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  color: z.string(),
})

export type CreateFunnelInput = z.infer<typeof createFunnelSchema>
