import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/types'
import { defaultTasks } from '@/mocks'
import { generateId } from '@/lib/utils'

interface TaskState {
  tasks: Task[]
  getByAccount: (accountId: string) => Task[]
  getToday: (accountId: string) => Task[]
  updateStatus: (id: string, status: Task['status']) => Task
  add: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task
  addDefaults: (projectIds: string[], accountId: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      getByAccount: (accountId) =>
        get().tasks.filter((t) => t.accountId === accountId),

      getToday: (accountId) =>
        get().tasks.filter((t) => t.accountId === accountId),

      updateStatus: (id, status) => {
        const now = new Date().toISOString()
        const tasks = get().tasks.map((t) =>
          t.id === id ? { ...t, status, updatedAt: now } : t,
        )
        const updated = tasks.find((t) => t.id === id)
        if (!updated) throw new Error('Tarefa nao encontrada')
        set({ tasks })
        return updated
      },

      add: (task) => {
        const now = new Date().toISOString()
        const newTask: Task = {
          id: generateId('task'),
          ...task,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return newTask
      },

      addDefaults: (projectIds, accountId) => {
        const now = new Date().toISOString()
        const today = now.split('T')[0]

        const newTasks: Task[] = defaultTasks.map((seed) => ({
          id: generateId('task'),
          title: seed.title,
          description: seed.description,
          status: seed.status,
          priority: seed.priority,
          dueDate: `${today}T${seed.dueTime}`,
          projectId: projectIds[seed.projectIndex] ?? projectIds[0],
          accountId,
          createdAt: now,
          updatedAt: now,
        }))

        set((state) => ({ tasks: [...state.tasks, ...newTasks] }))
      },
    }),
    {
      name: 'crm_tasks',
    },
  ),
)
