import { Logo } from "@/components/atoms/Logo"
import { LogoutButton } from "@/components/atoms/LogoutButton"

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Logo />
        <LogoutButton />
      </header>
      {children}
    </div>
  )
}
