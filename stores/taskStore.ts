import { create } from 'zustand'
import type { Task } from '@/types'

interface TaskState {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  upsertTask: (task: Task) => void
  upsertTasks: (tasks: Task[]) => void
  removeTask: (id: string) => void
}

function mergeById(existing: Task[], incoming: Task[]): Task[] {
  const byId = new Map(existing.map((t) => [t.id, t]))
  for (const t of incoming) byId.set(t.id, t)
  return Array.from(byId.values())
}

export const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  upsertTask: (task) =>
    set((state) => {
      const exists = state.tasks.some((t) => t.id === task.id)
      const next = exists
        ? state.tasks.map((t) => (t.id === task.id ? task : t))
        : [...state.tasks, task]
      return { tasks: next }
    }),

  upsertTasks: (tasks) =>
    set((state) => ({ tasks: mergeById(state.tasks, tasks) })),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}))
