"use client"

import { useState } from "react"
import { FunnelPageHeader } from "@/components/molecules/FunnelPageHeader"
import { FunnelListView } from "@/components/organisms/FunnelListView"
import { FunnelKanbanView } from "@/components/organisms/FunnelKanbanView"
import { ProjectFormDrawer } from "@/components/organisms/ProjectFormDrawer"
import { useFunnels } from "@/hooks/useFunnels"
import type { FunnelViewMode } from "@/types"

export default function FunnelPage() {
  const [view, setView] = useState<FunnelViewMode>("kanban")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { funnels } = useFunnels()

  return (
    <div className="flex flex-1 flex-col p-6 lg:p-8">
      <FunnelPageHeader
        view={view}
        onViewChange={setView}
        onNewProject={() => setDrawerOpen(true)}
      />

      {view === "kanban" && <FunnelKanbanView funnels={funnels} />}
      {view === "list" && <FunnelListView funnels={funnels} />}

      <ProjectFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        funnels={funnels}
      />
    </div>
  )
}
