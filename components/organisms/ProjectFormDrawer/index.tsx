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
import { ProjectFormFields } from "@/components/molecules/ProjectFormFields"
import { useProjectForm } from "@/hooks/forms/useProjectForm"
import type { Funnel, Project } from "@/types"

interface ProjectFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funnels: Funnel[]
  project?: Project | null
}

export function ProjectFormDrawer({
  open,
  onOpenChange,
  funnels,
  project,
}: ProjectFormDrawerProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useProjectForm({
    project,
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
            {isEditing ? "Editar Oportunidade" : "Nova Oportunidade"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Atualize os dados do projeto."
              : "Preencha os dados para criar um novo projeto no funil."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-w-0 flex-1 flex-col">
          <div className="min-w-0 flex-1 overflow-x-hidden px-4">
            <ProjectFormFields form={form} funnels={funnels} />
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
                : isEditing ? "Salvar Alteracoes" : "Criar Oportunidade"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
