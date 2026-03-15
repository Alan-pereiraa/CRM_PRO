"use client"

import { useEffect } from "react"
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
import { useProjectForm } from "@/hooks/useProject"
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
  const { values, errors, loading, isEditing, setValue, reset, loadProject, submit } =
    useProjectForm(() => {
      onOpenChange(false)
    })

  useEffect(() => {
    if (open && project) {
      loadProject(project)
    }
  }, [open, project, loadProject])

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md">
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

        <div className="min-w-0 flex-1 overflow-x-hidden px-4">
          <ProjectFormFields
            values={values}
            errors={errors}
            funnels={funnels}
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
              : isEditing ? "Salvar Alteracoes" : "Criar Oportunidade"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
