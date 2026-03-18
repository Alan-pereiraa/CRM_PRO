import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, UpdateTaskInput } from '@/types'
import { defaultTasks } from '@/mocks'
import { generateId } from '@/lib/utils'

interface TaskState {
  tasks: Task[]
  getByAccount: (accountId: string) => Task[]
  getByProject: (projectId: string) => Task[]
  getToday: (accountId: string) => Task[]
  updateStatus: (id: string, status: Task['status']) => Task
  update: (id: string, input: UpdateTaskInput) => Task
  add: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => Task
  addDefaults: (projectIds: string[], accountId: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      getByAccount: (accountId) =>
        get().tasks.filter((t) => t.accountId === accountId),

      getByProject: (projectId) =>
        get().tasks.filter((t) => t.projectId === projectId),

      getToday: (accountId) =>
        get().tasks.filter((t) => t.accountId === accountId),

      updateStatus: (id, status) => {
        const now = new Date().toISOString()
        const tasks = get().tasks.map((t) => {
          if (t.id !== id) return t
          return {
            ...t,
            status,
            updatedAt: now,
            completedAt: status === 'completed' ? now : undefined,
          }
        })
        const updated = tasks.find((t) => t.id === id)
        if (!updated) throw new Error('Tarefa nao encontrada')
        set({ tasks })
        return updated
      },

      update: (id, input) => {
        const now = new Date().toISOString()
        const tasks = get().tasks.map((t) => {
          if (t.id !== id) return t
          return {
            ...t,
            ...input,
            updatedAt: now,
            completedAt: input.status === 'completed' ? now : input.status ? undefined : t.completedAt,
          }
        })
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

        const newTasks: Task[] = defaultTasks.map((seed) => {
          const createdAt = seed.createdDaysAgo
            ? new Date(Date.now() - seed.createdDaysAgo * 86_400_000).toISOString()
            : now

          const completedAt =
            seed.status === 'completed' && seed.createdDaysAgo
              ? new Date(Date.now() - Math.max(0, seed.createdDaysAgo - 2) * 86_400_000).toISOString()
              : seed.status === 'completed'
                ? now
                : undefined

          return {
            id: generateId('task'),
            title: seed.title,
            description: seed.description,
            status: seed.status,
            priority: seed.priority,
            dueDate: `${today}T${seed.dueTime}`,
            projectId: projectIds[seed.projectIndex] ?? projectIds[0],
            accountId,
            createdAt,
            updatedAt: now,
            completedAt,
          }
        })

        set((state) => ({ tasks: [...state.tasks, ...newTasks] }))
      },
    }),
    {
      name: 'crm_tasks',
    },
  ),
)
