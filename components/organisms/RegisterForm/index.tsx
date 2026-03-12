"use client"

import { useState } from "react"
import Link from "next/link"
import { UserRound, Mail, LockKeyhole, KeyRound } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthFormField } from "@/components/molecules/AuthFormField"
import { useAuth } from "@/hooks/useAuth"
import { registerFormSchema } from "@/schemas"

export function RegisterForm() {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const result = registerFormSchema.safeParse(formData)
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
      await register(result.data.name, result.data.email, result.data.password)
      toast.success("Conta criada com sucesso!")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar conta"
      toast.error(message)
    }
  }

  return (
    <Card className="w-full max-w-[480px] shadow-sm">
      <div className="p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Crie sua conta
          </h1>
          <p className="text-[var(--text-secondary)]">
            Comece a gerenciar seus clientes de forma profissional hoje mesmo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AuthFormField
            label="Nome Completo"
            name="name"
            placeholder="Ex: João Silva"
            value={formData.name}
            onChange={handleChange}
            icon={<UserRound size={18} />}
            error={errors.name}
          />
          <AuthFormField
            label="E-mail Corporativo"
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
            placeholder="Mínimo 8 caracteres"
            type="password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockKeyhole size={18} />}
            showPasswordToggle
            error={errors.password}
          />
          <AuthFormField
            label="Confirmar Senha"
            name="confirmPassword"
            placeholder="Repita sua senha"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<KeyRound size={18} />}
            error={errors.confirmPassword}
          />
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-[var(--button-default)] text-base font-semibold text-white hover:bg-[var(--button-default)]/90"
          >
            {loading ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <p className="text-center text-xs text-[var(--text-secondary)]">
            Ao se registrar, você concorda com nossos{" "}
            <Link
              href="#"
              className="font-medium text-[var(--text-primary)] underline"
            >
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link
              href="#"
              className="font-medium text-[var(--text-primary)] underline"
            >
              Política de Privacidade
            </Link>
          </p>
          <Separator />
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--text-primary)]"
            >
              Entrar agora
            </Link>
          </p>
        </div>
      </div>
    </Card>
  )
}
