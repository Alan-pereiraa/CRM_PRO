import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types'
import { mockProjects } from '@/mocks'
import { generateId } from '@/lib/utils'

interface ProjectState {
  projects: Project[]
  getByAccount: (accountId: string) => Project[]
  getById: (id: string) => Project | undefined
  getByFunnel: (funnelId: string) => Project[]
  add: (input: CreateProjectInput, accountId: string) => Project
  update: (id: string, input: UpdateProjectInput) => Project
  move: (id: string, funnelId: string, position: number) => Project
  remove: (id: string) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: mockProjects,

      getByAccount: (accountId) =>
        get().projects.filter((p) => p.accountId === accountId),

      getById: (id) => get().projects.find((p) => p.id === id),

      getByFunnel: (funnelId) =>
        get()
          .projects.filter((p) => p.funnelId === funnelId)
          .sort((a, b) => a.position - b.position),

      add: (input, accountId) => {
        const now = new Date().toISOString()
        const projectsInFunnel = get().projects.filter(
          (p) => p.funnelId === input.funnelId,
        )
        const newProject: Project = {
          id: generateId('proj'),
          ...input,
          accountId,
          position: projectsInFunnel.length,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ projects: [...state.projects, newProject] }))
        return newProject
      },

      update: (id, input) => {
        const projects = get().projects.map((p) =>
          p.id === id
            ? { ...p, ...input, updatedAt: new Date().toISOString() }
            : p,
        )
        const updated = projects.find((p) => p.id === id)
        if (!updated) throw new Error('Projeto nao encontrado')
        set({ projects })
        return updated
      },

      move: (id, funnelId, position) => {
        const projects = get().projects.map((p) =>
          p.id === id
            ? { ...p, funnelId, position, updatedAt: new Date().toISOString() }
            : p,
        )
        const moved = projects.find((p) => p.id === id)
        if (!moved) throw new Error('Projeto nao encontrado')
        set({ projects })
        return moved
      },

      remove: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }))
      },
    }),
    {
      name: 'crm_projects',
    },
  ),
)
