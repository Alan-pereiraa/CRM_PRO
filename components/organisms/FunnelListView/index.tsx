"use client"

import { FunnelListGroup } from "@/components/organisms/FunnelListGroup"
import type { FunnelWithProjects } from "@/types"

interface FunnelListViewProps {
  funnels: FunnelWithProjects[]
}

export function FunnelListView({ funnels }: FunnelListViewProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {funnels.map((funnel) => (
        <FunnelListGroup key={funnel.id} funnel={funnel} />
      ))}
    </div>
  )
}
