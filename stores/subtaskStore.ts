import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Subtask, CreateSubtaskInput } from '@/types'
import { mockSubtasks } from '@/mocks'
import { generateId } from '@/lib/utils'

interface SubtaskState {
  subtasks: Subtask[]
  getByProject: (projectId: string) => Subtask[]
  add: (input: CreateSubtaskInput) => Subtask
  toggle: (id: string) => Subtask
  remove: (id: string) => void
}

export const useSubtaskStore = create<SubtaskState>()(
  persist(
    (set, get) => ({
      subtasks: mockSubtasks,

      getByProject: (projectId) =>
        get()
          .subtasks.filter((s) => s.projectId === projectId)
          .sort((a, b) => a.position - b.position),

      add: (input) => {
        const existing = get().subtasks.filter(
          (s) => s.projectId === input.projectId,
        )
        const newSubtask: Subtask = {
          id: generateId('sub'),
          title: input.title,
          completed: false,
          projectId: input.projectId,
          createdAt: new Date().toISOString(),
          position: existing.length,
        }
        set((state) => ({ subtasks: [...state.subtasks, newSubtask] }))
        return newSubtask
      },

      toggle: (id) => {
        const subtasks = get().subtasks.map((s) =>
          s.id === id ? { ...s, completed: !s.completed } : s,
        )
        const toggled = subtasks.find((s) => s.id === id)
        if (!toggled) throw new Error('Subtask nao encontrada')
        set({ subtasks })
        return toggled
      },

      remove: (id) => {
        set((state) => ({
          subtasks: state.subtasks.filter((s) => s.id !== id),
        }))
      },
    }),
    {
      name: 'crm_subtasks',
    },
  ),
)
