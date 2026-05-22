"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services"
import { tokenStorage } from "@/lib/tokenStorage"
import { useCurrentUser } from "./useCurrentUser"

export function useAuth() {
  const { data: user } = useCurrentUser()
  return {
    user: user ?? null,
    isAuthenticated: !!user,
  }
}

export function useLogout() {
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      tokenStorage.clear()
      qc.clear()
      router.push("/login")
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao sair")
    },
  })
}
