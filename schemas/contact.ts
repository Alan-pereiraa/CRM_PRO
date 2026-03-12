import { z } from 'zod'

export const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(8, 'Telefone deve ter pelo menos 8 caracteres'),
  role: z.string().min(1, 'Cargo e obrigatorio'),
  projectId: z.string(),
  createdAt: z.string(),
})

export const createContactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(8, 'Telefone deve ter pelo menos 8 caracteres'),
  role: z.string().min(1, 'Cargo e obrigatorio'),
  projectId: z.string(),
})

export const updateContactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email invalido').optional(),
  phone: z.string().min(8, 'Telefone deve ter pelo menos 8 caracteres').optional(),
  role: z.string().min(1, 'Cargo e obrigatorio').optional(),
})
