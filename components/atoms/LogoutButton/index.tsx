"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function LogoutButton() {
  const { logout, loading } = useAuth()

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={logout}
      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    >
      <LogOut size={16} className="mr-2" />
      Sair
    </Button>
  )
}
