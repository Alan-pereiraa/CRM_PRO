export interface Account {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export type PublicAccount = Omit<Account, 'password'>
