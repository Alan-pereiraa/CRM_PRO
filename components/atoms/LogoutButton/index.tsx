"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useAuth"

export function LogoutButton() {
  const logout = useLogout()

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={logout.isPending}
      onClick={() => logout.mutate()}
      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    >
      <LogOut size={16} className="mr-2" />
      Sair
    </Button>
  )
}
