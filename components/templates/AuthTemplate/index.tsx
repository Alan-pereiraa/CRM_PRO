import { Logo } from "@/components/atoms/Logo"

interface AuthTemplateProps {
  children: React.ReactNode
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F6F7F7] p-4">
      <div className="fixed left-6 top-6">
        <Logo />
      </div>
      {children}
    </div>
  )
}
