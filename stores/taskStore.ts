import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types'
import { mockTasks } from '@/mocks'

interface TaskState {
  tasks: Task[]
  getToday: () => Task[]
  toggle: (id: string) => Task
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,

      getToday: () => get().tasks,

      toggle: (id) => {
        const tasks = get().tasks.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t,
        )

        const toggled = tasks.find((t) => t.id === id)
        if (!toggled) throw new Error('Tarefa nao encontrada')
        set({ tasks })
        return toggled
      },
    }),
    {
      name: 'crm_tasks',
    },
  ),
)
