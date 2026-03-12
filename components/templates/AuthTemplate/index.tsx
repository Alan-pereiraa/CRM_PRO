import { Logo } from "@/components/atoms/Logo"

interface AuthTemplateProps {
  children: React.ReactNode
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F6F7F7]">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
        {children}
      </div>
    </div>
  )
}
