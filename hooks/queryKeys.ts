export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: () => [...projectKeys.lists()] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  full: (id: string) => [...projectKeys.detail(id), 'full'] as const,
}

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...taskKeys.lists(), filters ?? {}] as const,
  today: () => [...taskKeys.all, 'today'] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
}

export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: () => [...contactKeys.lists()] as const,
  byProject: (projectId: string) =>
    [...contactKeys.all, 'project', projectId] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
}

export const funnelKeys = {
  all: ['funnels'] as const,
  lists: () => [...funnelKeys.all, 'list'] as const,
  list: () => [...funnelKeys.lists()] as const,
  details: () => [...funnelKeys.all, 'detail'] as const,
  detail: (id: string) => [...funnelKeys.details(), id] as const,
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
}
