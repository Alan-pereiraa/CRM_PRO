import type { RawOverview } from '@/types'
import { api } from '@/lib/api'

interface RequestOpts {
  signal?: AbortSignal
}

export const dashboardService = {
  async getOverview(opts: RequestOpts = {}): Promise<RawOverview> {
    return api.get<RawOverview>('/dashboard/overview', { signal: opts.signal })
  },
}
