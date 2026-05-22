"use client"

import Link from "next/link"
import { Mail, LockKeyhole, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthFormField } from "@/components/molecules/AuthFormField"
import { useLoginForm } from "@/hooks/forms/useLoginForm"

export function LoginForm() {
  const { form, onSubmit, isSubmitting } = useLoginForm()
  const { register, formState: { errors } } = form

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

        <form onSubmit={onSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <AuthFormField
            label="E-mail"
            placeholder="seu@email.com"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            register={register("email")}
          />
          <AuthFormField
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
            icon={<LockKeyhole size={18} />}
            showPasswordToggle
            error={errors.password?.message}
            register={register("password")}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 w-full rounded-xl bg-[var(--button-default)] text-sm font-semibold text-white hover:bg-[var(--button-default)]/90 sm:h-12 sm:text-base"
          >
            {isSubmitting ? (
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
