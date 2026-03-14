import type { Contact, CreateContactInput, UpdateContactInput } from '@/types'
import { useContactStore } from '@/stores'
import { delay } from '@/lib/utils'

export const contactService = {
  async getByProject(projectId: string): Promise<Contact[]> {
    await delay()
    return useContactStore.getState().getByProject(projectId)
  },

  async create(input: CreateContactInput): Promise<Contact> {
    await delay()
    return useContactStore.getState().add(input)
  },

  async update(id: string, input: UpdateContactInput): Promise<Contact> {
    await delay()
    return useContactStore.getState().update(id, input)
  },

  async delete(id: string): Promise<void> {
    await delay()
    useContactStore.getState().remove(id)
  },

  createDefaultContacts(projectIds: string[]): void {
    useContactStore.getState().addDefaults(projectIds)
  },
}
