import Link from "next/link"
import { Logo } from "@/components/atoms/Logo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F6F7F7] p-4">
      <div className="fixed left-6 top-6">
        <Logo />
      </div>
      <Card className="w-full max-w-[480px] shadow-sm">
        <div className="p-8 text-center">
          <p className="text-7xl font-bold text-[var(--background-graphic)]">404</p>
          <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
            Página não encontrada
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Button className="mt-8 h-12 w-full rounded-xl bg-[var(--button-default)] text-base font-semibold text-white hover:bg-[var(--button-default)]/90">
            <Link className="flex gap-2 items-center" href="/">
              <ArrowLeft size={18} className="mr-1" /> Voltar ao início
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
