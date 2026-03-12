export interface Subtask {
  id: string
  title: string
  completed: boolean
  projectId: string
  createdAt: string
  position: number
}

export interface CreateSubtaskInput {
  title: string
  projectId: string
}
