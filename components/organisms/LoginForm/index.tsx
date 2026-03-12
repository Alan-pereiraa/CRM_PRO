"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, LockKeyhole, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthFormField } from "@/components/molecules/AuthFormField"
import { useAuth } from "@/hooks/useAuth"
import { loginSchema } from "@/schemas"

export function LoginForm() {
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      await login(result.data.email, result.data.password)
      toast.success("Login realizado com sucesso!")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer login"
      toast.error(message)
    }
  }

  return (
    <Card className="w-full max-w-[480px] shadow-sm">
      <div className="p-5 sm:p-8">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
            Bem-vindo ao CRMPro
          </h1>
          <p className="text-sm text-[var(--text-secondary)] sm:text-base">
            Faça login para gerenciar seus clientes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <AuthFormField
            label="E-mail"
            name="email"
            placeholder="seu@email.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={18} />}
            error={errors.email}
          />
          <AuthFormField
            label="Senha"
            name="password"
            placeholder="Digite sua senha"
            type="password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockKeyhole size={18} />}
            showPasswordToggle
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 w-full rounded-xl bg-[var(--button-default)] text-sm font-semibold text-white hover:bg-[var(--button-default)]/90 sm:h-12 sm:text-base"
          >
            {loading ? (
              "Entrando..."
            ) : (
              <>
                Entrar <ArrowRight size={18} className="ml-1" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <Separator />
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--text-primary)]"
            >
              Criar uma conta
            </Link>
          </p>
        </div>
      </div>
    </Card>
  )
}
