"use client"

import { FunnelListGroup } from "@/components/organisms/FunnelListGroup"
import type { FunnelWithProjects, Project } from "@/types"

interface FunnelListViewProps {
  funnels: FunnelWithProjects[]
  onEditProject?: (project: Project) => void
}

export function FunnelListView({ funnels, onEditProject }: FunnelListViewProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {funnels.map((funnel) => (
        <FunnelListGroup key={funnel.id} funnel={funnel} onEditProject={onEditProject} />
      ))}
    </div>
  )
}
