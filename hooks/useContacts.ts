'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { contactService } from '@/services/contactService'
import { useAuthStore } from '@/stores'
import { contactKeys, projectKeys } from './queryKeys'
import type { Contact, CreateContactInput, UpdateContactInput } from '@/types'

function toastError(fallback: string) {
  return (err: unknown) => {
    toast.error(err instanceof Error ? err.message : fallback)
  }
}

export function useContacts() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: contactKeys.list(),
    queryFn: ({ signal }) => contactService.getAll({ signal }),
    enabled: !!user,
  })
}

export function useContactsByProject(projectId: string) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: contactKeys.byProject(projectId),
    queryFn: ({ signal }) => contactService.getByProject(projectId, { signal }),
    enabled: !!user && !!projectId,
  })
}

function invalidateContactScopes(
  qc: ReturnType<typeof useQueryClient>,
  projectId?: string,
) {
  qc.invalidateQueries({ queryKey: contactKeys.all })
  if (projectId) qc.invalidateQueries({ queryKey: projectKeys.full(projectId) })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateContactInput) => contactService.create(input),
    onSuccess: (contact: Contact) => invalidateContactScopes(qc, contact.projectId),
    onError: toastError('Erro ao criar contato'),
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContactInput }) =>
      contactService.update(id, input),
    onSuccess: (contact: Contact) => invalidateContactScopes(qc, contact.projectId),
    onError: toastError('Erro ao atualizar contato'),
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId?: string }) =>
      contactService.delete(id),
    onSuccess: (_, { projectId }) => invalidateContactScopes(qc, projectId),
    onError: toastError('Erro ao excluir contato'),
  })
}
