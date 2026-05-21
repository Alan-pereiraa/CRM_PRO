import type { PublicAccount } from '@/types'
import { useAuthStore } from '@/stores'
import { api, ApiError } from '@/lib/api'

interface AuthResponse {
  account: PublicAccount
  accessToken: string
}

export const authService = {
  async login(email: string, password: string): Promise<PublicAccount> {
    const res = await api.post<AuthResponse>('/auth/sign-in', { email, password })
    useAuthStore.getState().signIn(res.account, res.accessToken)
    return res.account
  },

  async register(name: string, email: string, password: string): Promise<PublicAccount> {
    const res = await api.post<AuthResponse>('/auth/sign-up', { name, email, password })
    useAuthStore.getState().signIn(res.account, res.accessToken)
    return res.account
  },

  async getCurrentUser(): Promise<PublicAccount | null> {
    const token = useAuthStore.getState().token
    if (!token) return null
    try {
      const account = await api.get<PublicAccount>('/auth/profile')
      useAuthStore.getState().setUser(account)
      return account
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        useAuthStore.getState().signOut()
        return null
      }
      throw err
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/sign-out')
    } catch {
    }
    useAuthStore.getState().signOut()
  },
}
