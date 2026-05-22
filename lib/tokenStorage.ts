const TOKEN_KEY = 'crm_token'
const MARKER_COOKIE = 'crm_auth_token'

function writeMarkerCookie(present: boolean): void {
  if (typeof document === 'undefined') return
  if (present) {
    document.cookie = `${MARKER_COOKIE}=1; path=/; samesite=lax`
  } else {
    document.cookie = `${MARKER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(TOKEN_KEY)
  },

  set(token: string): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(TOKEN_KEY, token)
    writeMarkerCookie(true)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(TOKEN_KEY)
    writeMarkerCookie(false)
  },
}
