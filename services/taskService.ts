import type { Task } from '@/types'
import { useTaskStore } from '@/stores'
import { delay } from '@/lib/utils'

export const taskService = {
  async getToday(): Promise<Task[]> {
    await delay()
    return useTaskStore.getState().getToday()
  },

  async toggle(id: string): Promise<Task> {
    await delay()
    return useTaskStore.getState().toggle(id)
  },
}
