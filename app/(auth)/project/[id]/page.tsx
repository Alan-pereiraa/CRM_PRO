import { ProjectDetailContent } from './ProjectDetailContent'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  return <ProjectDetailContent projectId={id} />
}
