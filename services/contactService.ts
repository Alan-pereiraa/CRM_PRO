import type { Contact, CreateContactInput, UpdateContactInput } from '@/types'
import { api } from '@/lib/api'

interface RequestOpts {
  signal?: AbortSignal
}

export const contactService = {
  async getAll(opts: RequestOpts = {}): Promise<Contact[]> {
    return api.get<Contact[]>('/contacts', { signal: opts.signal })
  },

  async getById(id: string, opts: RequestOpts = {}): Promise<Contact> {
    return api.get<Contact>(`/contacts/${id}`, { signal: opts.signal })
  },

  async getByProject(projectId: string, opts: RequestOpts = {}): Promise<Contact[]> {
    return api.get<Contact[]>(`/contacts/projects/${projectId}`, {
      signal: opts.signal,
    })
  },

  async search(query: string, opts: RequestOpts = {}): Promise<Contact[]> {
    return api.get<Contact[]>('/contacts/search', {
      query: { q: query },
      signal: opts.signal,
    })
  },

  async create(input: CreateContactInput): Promise<Contact> {
    return api.post<Contact>('/contacts', input)
  },

  async update(id: string, input: UpdateContactInput): Promise<Contact> {
    return api.patch<Contact>(`/contacts/${id}`, input)
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/contacts/${id}`)
  },
}
