import type { PublicAccount } from '@/types'
import { api, ApiError } from '@/lib/api'
import { tokenStorage } from '@/lib/tokenStorage'

export interface AuthResponse {
  account: PublicAccount
  accessToken: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/sign-in', { email, password })
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/sign-up', { name, email, password })
  },

  async getCurrentUser(): Promise<PublicAccount | null> {
    if (!tokenStorage.get()) return null
    try {
      return await api.get<PublicAccount>('/auth/profile')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        tokenStorage.clear()
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
  },
}
