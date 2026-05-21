import { create } from 'zustand'
import type { Project } from '@/types'

interface ProjectState {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  upsertProject: (project: Project) => void
  removeProject: (id: string) => void
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),

  upsertProject: (project) =>
    set((state) => {
      const exists = state.projects.some((p) => p.id === project.id)
      const next = exists
        ? state.projects.map((p) => (p.id === project.id ? project : p))
        : [...state.projects, project]
      return { projects: next }
    }),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
}))
