import type { Subtask, CreateSubtaskInput } from '@/types'
import { useSubtaskStore } from '@/stores'
import { delay } from '@/lib/utils'

export const subtaskService = {
  async getByProject(projectId: string): Promise<Subtask[]> {
    await delay()
    return useSubtaskStore.getState().getByProject(projectId)
  },

  async create(input: CreateSubtaskInput): Promise<Subtask> {
    await delay()
    return useSubtaskStore.getState().add(input)
  },

  async toggle(id: string): Promise<Subtask> {
    await delay()
    return useSubtaskStore.getState().toggle(id)
  },

  async delete(id: string): Promise<void> {
    await delay()
    useSubtaskStore.getState().remove(id)
  },
}
