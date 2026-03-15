"use client"

import { useState } from "react"
import { FunnelPageHeader } from "@/components/molecules/FunnelPageHeader"
import { FunnelListView } from "@/components/organisms/FunnelListView"
import { FunnelKanbanView } from "@/components/organisms/FunnelKanbanView"
import { ProjectFormDrawer } from "@/components/organisms/ProjectFormDrawer"
import { useFunnels } from "@/hooks/useFunnels"
import type { FunnelViewMode, Project } from "@/types"

export default function FunnelPage() {
  const [view, setView] = useState<FunnelViewMode>("kanban")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { funnels } = useFunnels()

  const handleNewProject = () => {
    setEditingProject(null)
    setDrawerOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setDrawerOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col p-6 lg:p-8">
      <FunnelPageHeader
        view={view}
        onViewChange={setView}
        onNewProject={handleNewProject}
      />

      {view === "kanban" && <FunnelKanbanView funnels={funnels} onEditProject={handleEditProject} />}
      {view === "list" && <FunnelListView funnels={funnels} onEditProject={handleEditProject} />}

      <ProjectFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        funnels={funnels}
        project={editingProject}
      />
    </div>
  )
}
