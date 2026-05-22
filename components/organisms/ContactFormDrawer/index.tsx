"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { ContactFormFields } from "@/components/molecules/ContactFormFields"
import { useContactForm } from "@/hooks/forms/useContactForm"
import type { Contact } from "@/types"

interface ContactFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  contact?: Contact | null
}

export function ContactFormDrawer({
  open,
  onOpenChange,
  projectId,
  contact,
}: ContactFormDrawerProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useContactForm({
    projectId,
    contact,
    onSuccess: () => onOpenChange(false),
  })

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="flex flex-col overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-[var(--text-primary)]">
            {isEditing ? "Editar Contato" : "Novo Contato"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Atualize os dados do contato."
              : "Preencha os dados para criar um novo contato."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-w-0 flex-1 flex-col">
          <div className="min-w-0 flex-1 overflow-x-hidden px-4">
            <ContactFormFields form={form} />
          </div>

          <SheetFooter className="flex-row gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--button-default)] text-white hover:bg-[var(--button-default)]/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing ? "Salvando..." : "Criando..."
                : isEditing ? "Salvar Alteracoes" : "Criar Contato"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
