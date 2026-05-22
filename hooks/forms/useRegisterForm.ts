'use client'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { registerFormSchema, type RegisterFormInput } from '@/schemas'
import { authService } from '@/services'
import { tokenStorage } from '@/lib/tokenStorage'
import { authKeys } from '@/hooks/useCurrentUser'

export type RegisterFormValues = RegisterFormInput

interface UseRegisterFormResult {
  form: UseFormReturn<RegisterFormValues>
  onSubmit: () => void
  isSubmitting: boolean
}

export function useRegisterForm(): UseRegisterFormResult {
  const router = useRouter()
  const qc = useQueryClient()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: RegisterFormValues) =>
      authService.register(name, email, password),
    onSuccess: ({ account, accessToken }) => {
      tokenStorage.set(accessToken)
      qc.setQueryData(authKeys.me(), account)
      toast.success('Conta criada com sucesso!')
      router.push('/')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar conta')
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
