import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Contact, CreateContactInput, UpdateContactInput } from '@/types'
import { mockContacts } from '@/mocks'
import { generateId } from '@/lib/utils'

interface ContactState {
  contacts: Contact[]
  getByProject: (projectId: string) => Contact[]
  add: (input: CreateContactInput) => Contact
  update: (id: string, input: UpdateContactInput) => Contact
  remove: (id: string) => void
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: mockContacts,

      getByProject: (projectId) =>
        get().contacts.filter((c) => c.projectId === projectId),

      add: (input) => {
        const newContact: Contact = {
          id: generateId('contact'),
          ...input,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ contacts: [...state.contacts, newContact] }))
        return newContact
      },

      update: (id, input) => {
        const contacts = get().contacts.map((c) =>
          c.id === id ? { ...c, ...input } : c,
        )
        const updated = contacts.find((c) => c.id === id)
        if (!updated) throw new Error('Contato nao encontrado')
        set({ contacts })
        return updated
      },

      remove: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }))
      },
    }),
    {
      name: 'crm_contacts',
    },
  ),
)
