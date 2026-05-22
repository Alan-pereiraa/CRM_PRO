'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectService, type ProjectDetail } from '@/services/projectService'
import { useAuthStore } from '@/stores'
import { projectKeys, taskKeys, contactKeys, dashboardKeys } from './queryKeys'
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatus,
} from '@/types'

function toastError(fallback: string) {
  return (err: unknown) => {
    toast.error(err instanceof Error ? err.message : fallback)
  }
}

export function useProjects() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: ({ signal }) => projectService.getAll({ signal }),
    enabled: !!user,
  })
}

export function useProject(id: string) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => projectService.getById(id, { signal }),
    enabled: !!user && !!id,
  })
}

export function useProjectDetails(id: string) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: projectKeys.full(id),
    queryFn: ({ signal }) => projectService.getDetails(id, { signal }),
    enabled: !!user && !!id,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: toastError('Erro ao criar projeto'),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      projectService.update(id, input),
    onSuccess: (project: Project) => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: dashboardKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.full(project.id) })
    },
    onError: toastError('Erro ao atualizar projeto'),
  })
}

export function useUpdateProjectStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: toastError('Erro ao atualizar status do projeto'),
  })
}

export function useReorderProjects() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (updates: Array<{ id: string; funnelId: string; position: number }>) =>
      projectService.reorderProjects(updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: toastError('Erro ao reordenar projetos'),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: dashboardKeys.all })
      qc.removeQueries({ queryKey: projectKeys.detail(id) })
      qc.removeQueries({ queryKey: projectKeys.full(id) })
      qc.invalidateQueries({ queryKey: taskKeys.all })
      qc.invalidateQueries({ queryKey: contactKeys.all })
    },
    onError: toastError('Erro ao excluir projeto'),
  })
}

export type { ProjectDetail }
