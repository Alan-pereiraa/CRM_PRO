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
import { TaskFormFields } from "@/components/molecules/TaskFormFields"
import { useTaskForm } from "@/hooks/useTask"
import type { Task } from "@/types"

interface TaskFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  task?: Task | null
}

export function TaskFormDrawer({
  open,
  onOpenChange,
  projectId,
  task,
}: TaskFormDrawerProps) {
  const { values, errors, loading, isEditing, setValue, reset, submit } =
    useTaskForm({
      projectId,
      task,
      onSuccess: () => onOpenChange(false),
    })

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-[var(--text-primary)]">
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Atualize os dados da tarefa."
              : "Preencha os dados para criar uma nova tarefa."}
          </SheetDescription>
        </SheetHeader>

        <div className="min-w-0 flex-1 overflow-x-hidden px-4">
          <TaskFormFields
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
              : isEditing ? "Salvar Alteracoes" : "Criar Tarefa"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
