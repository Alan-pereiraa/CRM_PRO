import type { Task } from '@/types'
import { useTaskStore } from '@/stores'
import { delay } from '@/lib/utils'

export const taskService = {
  async getToday(accountId: string): Promise<Task[]> {
    await delay()
    return useTaskStore.getState().getToday(accountId)
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    await delay()
    return useTaskStore.getState().updateStatus(id, status)
  },

  createDefaultTasks(projectIds: string[], accountId: string): void {
    useTaskStore.getState().addDefaults(projectIds, accountId)
  },
}
