'use client'

import { useState, useCallback } from 'react'
import { useProject } from '@/hooks/useProject'
import { useTasksTable } from '@/hooks/useTask'
import { taskService, contactService } from '@/services'
import { ProjectHeader } from '@/components/organisms/ProjectHeader'
import { TaskFormDrawer } from '@/components/organisms/TaskFormDrawer'
import { TasksTableFilter } from '@/components/molecules/TasksTableFilter'
import { TasksTable } from '@/components/organisms/TasksTable'
import { TasksTablePagination } from '@/components/molecules/TasksTablePagination'
import { ContactsList } from '@/components/organisms/ContactsList'
import { ContactFormDrawer } from '@/components/organisms/ContactFormDrawer'
import type { Task, Contact } from '@/types'

interface ProjectDetailContentProps {
  projectId: string
}

export function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const { project, tasks: allTasks, contacts, stats, loading, deleteProject } = useProject(projectId)
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const {
    tasks,
    totalCount,
    page,
    totalPages,
    nextPage,
    prevPage,
    filters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
  } = useTasksTable(allTasks)

  const handleCreateTask = useCallback(() => {
    setEditingTask(null)
    setTaskDrawerOpen(true)
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    setEditingTask(task)
    setTaskDrawerOpen(true)
  }, [])

  const handleToggleComplete = useCallback((task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    taskService.updateStatus(task.id, newStatus)
  }, [])

  const handleCreateContact = useCallback(() => {
    setEditingContact(null)
    setContactDrawerOpen(true)
  }, [])

  const handleEditContact = useCallback((contact: Contact) => {
    setEditingContact(contact)
    setContactDrawerOpen(true)
  }, [])

  const handleDeleteContact = useCallback((contact: Contact) => {
    if (!confirm(`Excluir o contato ${contact.name}?`)) return
    contactService.delete(contact.id)
  }, [])

  if (loading) {
    return <ProjectHeaderSkeleton />
  }

  if (!project) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-[var(--text-secondary)]">Projeto não encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <ProjectHeader
        project={project}
        stats={stats}
        onCreateTask={handleCreateTask}
        onDelete={deleteProject}
      />

      <TasksTableFilter
        search={filters.search}
        status={filters.status}
        priority={filters.priority}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <TasksTable
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onTaskClick={handleTaskClick}
      />

      <TasksTablePagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={6}
        onPrev={prevPage}
        onNext={nextPage}
      />

      <ContactsList
        contacts={contacts}
        onAdd={handleCreateContact}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />

      <TaskFormDrawer
        open={taskDrawerOpen}
        onOpenChange={setTaskDrawerOpen}
        projectId={projectId}
        task={editingTask}
      />

      <ContactFormDrawer
        open={contactDrawerOpen}
        onOpenChange={setContactDrawerOpen}
        projectId={projectId}
        contact={editingContact}
      />
    </div>
  )
}

function ProjectHeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded bg-gray-200" />
        <div className="h-4 w-96 rounded bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] p-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl bg-white p-5">
            <div className="h-3 w-28 rounded bg-gray-200" />
            <div className="h-7 w-20 rounded bg-gray-200" />
            <div className="h-3 w-40 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
