import { create } from 'zustand'
import type { Contact } from '@/types'

interface ContactState {
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
  upsertContact: (contact: Contact) => void
  upsertContacts: (contacts: Contact[]) => void
  removeContact: (id: string) => void
}

function mergeById(existing: Contact[], incoming: Contact[]): Contact[] {
  const byId = new Map(existing.map((c) => [c.id, c]))
  for (const c of incoming) byId.set(c.id, c)
  return Array.from(byId.values())
}

export const useContactStore = create<ContactState>()((set) => ({
  contacts: [],

  setContacts: (contacts) => set({ contacts }),

  upsertContact: (contact) =>
    set((state) => {
      const exists = state.contacts.some((c) => c.id === contact.id)
      const next = exists
        ? state.contacts.map((c) => (c.id === contact.id ? contact : c))
        : [...state.contacts, contact]
      return { contacts: next }
    }),

  upsertContacts: (contacts) =>
    set((state) => ({ contacts: mergeById(state.contacts, contacts) })),

  removeContact: (id) =>
    set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
}))
