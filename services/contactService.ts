import type { Contact, CreateContactInput, UpdateContactInput } from '@/types'
import { useContactStore, useUiStore } from '@/stores'
import { api } from '@/lib/api'

async function withErrorReport<T>(fn: () => Promise<T>, fallback: string): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    const message = err instanceof Error ? err.message : fallback
    useUiStore.getState().setError('contact', message)
    throw err
  }
}

export const contactService = {
  async getAll(): Promise<Contact[]> {
    const ui = useUiStore.getState()
    ui.setLoading('contact', true)
    ui.setError('contact', null)
    try {
      const data = await api.get<Contact[]>('/contacts')
      useContactStore.getState().setContacts(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar contatos'
      useUiStore.getState().setError('contact', message)
      throw err
    } finally {
      useUiStore.getState().setLoading('contact', false)
    }
  },

  async getById(id: string): Promise<Contact> {
    return withErrorReport(async () => {
      const contact = await api.get<Contact>(`/contacts/${id}`)
      useContactStore.getState().upsertContact(contact)
      return contact
    }, 'Erro ao carregar contato')
  },

  async getByProject(projectId: string): Promise<Contact[]> {
    return withErrorReport(async () => {
      const data = await api.get<Contact[]>(`/contacts/projects/${projectId}`)
      useContactStore.getState().upsertContacts(data)
      return data
    }, 'Erro ao carregar contatos do projeto')
  },

  async search(query: string): Promise<Contact[]> {
    return withErrorReport(
      () => api.get<Contact[]>('/contacts/search', { query: { q: query } }),
      'Erro ao buscar contatos',
    )
  },

  async create(input: CreateContactInput): Promise<Contact> {
    return withErrorReport(async () => {
      const contact = await api.post<Contact>('/contacts', input)
      useContactStore.getState().upsertContact(contact)
      return contact
    }, 'Erro ao criar contato')
  },

  async update(id: string, input: UpdateContactInput): Promise<Contact> {
    return withErrorReport(async () => {
      const contact = await api.patch<Contact>(`/contacts/${id}`, input)
      useContactStore.getState().upsertContact(contact)
      return contact
    }, 'Erro ao atualizar contato')
  },

  async delete(id: string): Promise<void> {
    await withErrorReport(async () => {
      await api.delete<void>(`/contacts/${id}`)
    }, 'Erro ao excluir contato')
    useContactStore.getState().removeContact(id)
  },
}
