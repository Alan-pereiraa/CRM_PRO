interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  return <h1 className="text-2xl font-bold">Projeto: {id}</h1>
}
