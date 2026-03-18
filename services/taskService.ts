import type { Task, UpdateTaskInput } from '@/types'
import { useTaskStore } from '@/stores'
import { delay } from '@/lib/utils'

export const taskService = {
  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    await delay()
    return useTaskStore.getState().updateStatus(id, status)
  },

  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>): Promise<Task> {
    await delay()
    return useTaskStore.getState().add(task)
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    await delay()
    return useTaskStore.getState().update(id, input)
  },

  createDefaultTasks(projectIds: string[], accountId: string): void {
    useTaskStore.getState().addDefaults(projectIds, accountId)
  },
}
