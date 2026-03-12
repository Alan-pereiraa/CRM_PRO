import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Account, PublicAccount } from '@/types'
import { mockAccounts } from '@/mocks'
import { generateId } from '@/lib/utils'

interface AuthState {
  accounts: Account[]
  user: PublicAccount | null
  token: string | null
  setUser: (user: PublicAccount | null) => void
  setToken: (token: string | null) => void
  addAccount: (account: Account) => void
  findAccountByEmail: (email: string) => Account | undefined
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: mockAccounts,
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      addAccount: (account) =>
        set((state) => ({ accounts: [...state.accounts, account] })),
      findAccountByEmail: (email) =>
        get().accounts.find((a) => a.email === email),
    }),
    {
      name: 'crm_auth',
    },
  ),
)

export function setCookieToken(token: string | null): void {
  if (token) {
    document.cookie = `crm_auth_token=${token}; path=/`
  } else {
    document.cookie = 'crm_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export function createAccountData(
  name: string,
  email: string,
  password: string,
): Account {
  return {
    id: generateId('user'),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  }
}
