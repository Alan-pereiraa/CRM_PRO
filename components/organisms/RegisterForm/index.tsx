"use client"

import Link from "next/link"
import { UserRound, Mail, LockKeyhole, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthFormField } from "@/components/molecules/AuthFormField"
import { useRegisterForm } from "@/hooks/forms/useRegisterForm"

export function RegisterForm() {
  const { form, onSubmit, isSubmitting } = useRegisterForm()
  const { register, formState: { errors } } = form

  return (
    <Card className="w-full max-w-[480px] shadow-sm">
      <div className="p-5 sm:p-8">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
            Crie sua conta
          </h1>
          <p className="text-sm text-[var(--text-secondary)] sm:text-base">
            Comece a gerenciar seus clientes de forma profissional hoje mesmo.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <AuthFormField
            label="Nome Completo"
            placeholder="Ex: João Silva"
            icon={<UserRound size={18} />}
            error={errors.name?.message}
            register={register("name")}
          />
          <AuthFormField
            label="E-mail Corporativo"
            placeholder="seu@email.com"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            register={register("email")}
          />
          <AuthFormField
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            type="password"
            icon={<LockKeyhole size={18} />}
            showPasswordToggle
            error={errors.password?.message}
            register={register("password")}
          />
          <AuthFormField
            label="Confirmar Senha"
            placeholder="Repita sua senha"
            type="password"
            icon={<KeyRound size={18} />}
            error={errors.confirmPassword?.message}
            register={register("confirmPassword")}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 w-full rounded-xl bg-[var(--button-default)] text-sm font-semibold text-white hover:bg-[var(--button-default)]/90 sm:h-12 sm:text-base"
          >
            {isSubmitting ? "Criando..." : "Criar Conta"}
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
