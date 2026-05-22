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
import { useContactForm } from "@/hooks/useContact"
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
  const { values, errors, loading, isEditing, setValue, reset, submit } =
    useContactForm({
      projectId,
      contact,
      onSuccess: () => onOpenChange(false),
    })

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
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

        <div className="min-w-0 flex-1 overflow-x-hidden px-4">
          <ContactFormFields
            values={values}
            errors={errors}
            onValueChange={setValue}
          />
        </div>

        <SheetFooter className="flex-row gap-3 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleClose(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-[var(--button-default)] text-white hover:bg-[var(--button-default)]/90"
            onClick={submit}
            disabled={loading}
          >
            {loading
              ? isEditing ? "Salvando..." : "Criando..."
              : isEditing ? "Salvar Alteracoes" : "Criar Contato"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
