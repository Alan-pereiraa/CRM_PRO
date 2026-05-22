'use client'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@/schemas'
import { authService } from '@/services'

export type LoginFormValues = LoginInput

interface UseLoginFormResult {
  form: UseFormReturn<LoginFormValues>
  onSubmit: () => void
  isSubmitting: boolean
}

export function useLoginForm(): UseLoginFormResult {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginFormValues) =>
      authService.login(email, password),
    onSuccess: () => {
      toast.success('Login realizado com sucesso!')
      router.push('/')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
