import projectsData from "@/public/data/projects.json"
import ProjectCaseStudy from "@/components/projects/project-case-study"

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  link?: string
  github?: string
  technologies: string[]
  featured: boolean
}

const projects = projectsData.projects as Project[]

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }))
}

export default async function SingleProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = parseInt(id, 10)
  
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  const project = projects[projectIndex]

  if (!project) return null

  const prevProject = projects[projectIndex - 1] || projects[projects.length - 1]
  const nextProject = projects[projectIndex + 1] || projects[0]

  return <ProjectCaseStudy project={project} previousProject={prevProject} nextProject={nextProject} />
}
