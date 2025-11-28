"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FolderOpen, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import projectsData from "@/public/data/projects.json"
import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

// Define the project type
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

const ProjectCard = ({ project, className, index }: { project: Project, className?: string, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-secondary/20 border border-border/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:border-primary/20",
        className
      )}
    >
      {/* Image Background with Parallax Effect on Hover */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-background/50 backdrop-blur-md border-border/50">
              {project.category}
            </Badge>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {project.github && (
                <Link href={project.github} target="_blank" className="p-2 rounded-full bg-background/50 hover:bg-background text-foreground transition-colors">
                  <Github className="h-4 w-4" />
                </Link>
              )}
              {project.link && (
                <Link href={project.link} target="_blank" className="p-2 rounded-full bg-background/50 hover:bg-background text-foreground transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight text-foreground">
            {project.title}
          </h3>

          <p className="text-muted-foreground line-clamp-2 mb-4 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs bg-background/50">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PortfolioSection() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const filtered = projectsData.projects.filter(project => project.featured)
      setFeaturedProjects(filtered)
    } catch (error) {
      console.error('Error loading projects:', error)
      setFeaturedProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <section className="py-32 bg-background">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[400px] bg-muted rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-32 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/5 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Selected Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A curated selection of my recent technical endeavors and creative solutions.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
          {featuredProjects.map((project, index) => {
            // Logic for Bento Grid sizing
            // First item spans 2 cols and 1 row
            // Fourth item spans 2 cols and 1 row
            // Others are 1x1
            const isLarge = index === 0 || index === 3
            const spanClass = isLarge ? "md:col-span-2" : "md:col-span-1"

            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                className={spanClass}
              />
            )
          })}

          {/* "See More" Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: featuredProjects.length * 0.1 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-secondary/10 border border-dashed border-border hover:bg-secondary/20 transition-colors cursor-pointer group"
          >
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-background flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">View All Projects</h3>
              <p className="text-muted-foreground mb-6 max-w-[200px] mx-auto">
                Explore the full archive of my work and experiments.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/projects">
                  Open Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
