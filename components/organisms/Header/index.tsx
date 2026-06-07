"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  LayoutGrid,
  FolderOpen,
  Filter,
  CalendarDays,
  Settings,
  Menu,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/atoms/Logo"
import { ThemeToggle } from "@/components/atoms/ThemeToggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: "Painel", href: "/", icon: <LayoutGrid size={16} /> },
  { label: "Funil", href: "/funnel", icon: <Filter size={16} /> },
]

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <>
      {/* Desktop header */}
      <header className="hidden border-b bg-white dark:bg-card lg:block">
        <div className="flex h-14 items-center gap-6 px-5">
          <Logo />

          <nav className="flex h-14 flex-1 items-center justify-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-full items-center gap-1.5 px-3 text-sm font-medium transition-colors ${
                    active
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--background-graphic)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar size="default">
              <AvatarFallback className="bg-[var(--background-graphic)] text-xs text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <header className="flex h-14 items-center justify-between border-b bg-white dark:bg-card px-4 lg:hidden">
        {mounted ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[#F1F5F9] dark:hover:bg-accent hover:text-[var(--text-primary)]">
            <Menu size={20} />
          </SheetTrigger>

          <SheetContent side="left" showCloseButton={false} className="w-72 p-0">
            <div className="flex h-14 items-center border-b px-5">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <Logo />
            </div>

            <nav className="flex flex-col gap-1 px-3 pt-4">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#F1F5F9] dark:bg-accent text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[#F1F5F9] dark:hover:bg-accent hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto border-t px-3 py-3">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[#F1F5F9] dark:hover:bg-accent hover:text-[var(--text-primary)]">
                <Settings size={16} />
                Configurações
              </button>
            </div>
          </SheetContent>
        </Sheet>
        ) : (
          <div className="h-9 w-9" aria-hidden />
        )}

        <Logo />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar size="default">
            <AvatarFallback className="bg-[var(--background-graphic)] text-xs text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
    </>
  )
}
