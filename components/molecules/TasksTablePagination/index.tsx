'use client'

import { Button } from '@/components/ui/button'

interface TasksTablePaginationProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPrev: () => void
  onNext: () => void
}

export function TasksTablePagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPrev,
  onNext,
}: TasksTablePaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">
        Mostrando {totalCount > 0 ? start : 0} de {totalCount} tarefas
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page <= 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
