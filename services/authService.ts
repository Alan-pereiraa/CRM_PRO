import type { PublicAccount } from '@/types'
import { useAuthStore, setCookieToken, createAccountData } from '@/stores'
import { delay } from '@/lib/utils'

function toPublic(account: { id: string; name: string; email: string; createdAt: string }): PublicAccount {
  return { id: account.id, name: account.name, email: account.email, createdAt: account.createdAt }
}

export const authService = {
  async login(email: string, password: string): Promise<PublicAccount> {
    await delay()
    const store = useAuthStore.getState()
    const account = store.findAccountByEmail(email)
    if (!account || account.password !== password) {
      throw new Error('Email ou senha incorretos')
    }
    const publicAccount = toPublic(account)
    const token = `token-${account.id}`
    store.setUser(publicAccount)
    store.setToken(token)
    setCookieToken(token)
    return publicAccount
  },

  async register(name: string, email: string, password: string): Promise<PublicAccount> {
    await delay()
    const store = useAuthStore.getState()
    const existing = store.findAccountByEmail(email)
    if (existing) {
      throw new Error('Email ja cadastrado')
    }
    const newAccount = createAccountData(name, email, password)
    store.addAccount(newAccount)
    const publicAccount = toPublic(newAccount)
    const token = `token-${newAccount.id}`
    store.setUser(publicAccount)
    store.setToken(token)
    setCookieToken(token)
    return publicAccount
  },

  async getCurrentUser(): Promise<PublicAccount | null> {
    await delay()
    return useAuthStore.getState().user
  },

  async logout(): Promise<void> {
    await delay()
    const store = useAuthStore.getState()
    store.setUser(null)
    store.setToken(null)
    setCookieToken(null)
  },
}
