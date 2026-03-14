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
import { useProjectForm } from "@/hooks/useProject"
import type { Funnel } from "@/types"

interface ProjectFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funnels: Funnel[]
}

export function ProjectFormDrawer({
  open,
  onOpenChange,
  funnels,
}: ProjectFormDrawerProps) {
  const { values, errors, loading, setValue, reset, submit } = useProjectForm(
    () => {
      onOpenChange(false)
    },
  )

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-[var(--text-primary)]">
            Nova Oportunidade
          </SheetTitle>
          <SheetDescription>
            Preencha os dados para criar um novo projeto no funil.
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
            {loading ? "Criando..." : "Criar Oportunidade"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
