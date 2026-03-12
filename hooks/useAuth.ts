"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services"
import { useAuthStore } from "@/stores"

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const account = await authService.register(name, email, password)
      router.push("/")
      return account
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const account = await authService.login(email, password)
      router.push("/")
      return account
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, register, login, logout }
}
