"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"
import { useAuthStore } from "@/stores"

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  return {
    user,
    isAuthenticated: !!user,
  }
}

export function useLogout() {
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push("/login")
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao sair")
    },
  })
}
