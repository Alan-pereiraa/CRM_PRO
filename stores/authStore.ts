import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PublicAccount } from '@/types'

interface AuthState {
  user: PublicAccount | null
  token: string | null
  setUser: (user: PublicAccount | null) => void
  setToken: (token: string | null) => void
  signIn: (user: PublicAccount, token: string) => void
  signOut: () => void
}

function writeMarkerCookie(present: boolean): void {
  if (typeof document === 'undefined') return
  if (present) {
    document.cookie = 'crm_auth_token=1; path=/'
  } else {
    document.cookie = 'crm_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      signIn: (user, token) => {
        writeMarkerCookie(true)
        set({ user, token })
      },
      signOut: () => {
        writeMarkerCookie(false)
        set({ user: null, token: null })
      },
    }),
    {
      name: 'crm_auth',
    },
  ),
)
