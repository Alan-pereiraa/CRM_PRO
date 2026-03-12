export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: string
  projectId: string
  createdAt: string
}

export interface CreateContactInput {
  name: string
  email: string
  phone: string
  role: string
  projectId: string
}

export interface UpdateContactInput {
  name?: string
  email?: string
  phone?: string
  role?: string
}
