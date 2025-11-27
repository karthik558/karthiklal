"use client"

import { useState, useEffect } from "react"
import { FeatureSteps } from "@/components/blocks/feature-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FolderOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import projectsData from "@/public/data/projects.json"
import { AnimatedButton } from "@/components/ui/animated-button"

// Define the project type based on the JSON structure
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

export default function PortfolioSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and set visibility
    const timer = setTimeout(() => {
      setIsVisible(true)
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    try {
      // Filter only featured projects with error handling
      const filtered = projectsData.projects.filter(project => project.featured)
      setFeaturedProjects(filtered)
    } catch (error) {
      console.error('Error loading projects:', error)
      setFeaturedProjects([])
    }
  }, [])

  // Convert featured project data to feature format with better error handling
  const features = featuredProjects.map((project, index) => {
    // Improved text truncation with better word boundaries
    const truncateText = (text: string, maxLength: number) => {
      if (!text || text.length <= maxLength) return text;
      const truncated = text.substring(0, maxLength).trim();
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
    };

    return {
      step: `Featured ${index + 1}`,
      title: project.title || `Project ${index + 1}`,
      content: truncateText(project.description || 'No description available', 140), // Increased limit slightly
      image: project.image || "/placeholder.svg?height=500&width=800",
      github: project.github || undefined,
      link: project.link || undefined
    }
  })

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mx-auto mb-4"></div>
              <div className="h-12 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-background relative overflow-hidden">


      <div className="container relative z-10">

        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            My Work
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-gradient">Projects</span></h2>
          <p className="text-muted-foreground">
            A curated selection of my best projects showcasing expertise in web development, system administration, and creative problem-solving with cutting-edge technologies.
          </p>
        </motion.div>

        {features.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <FeatureSteps
              features={features}
              title=""
              autoPlayInterval={6000} // Increased interval for better UX
              imageHeight="h-[500px]"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-muted-foreground">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No featured projects available at the moment.</p>
            </div>
          </motion.div>
        )}

        {/* Enhanced View All Projects Button */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatedButton href="/projects" variant="primary">
            <FolderOpen className="h-5 w-5 mr-2" />
            View All Projects <span className="text-sm opacity-80 ml-1">({projectsData.projects.length})</span>
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  )
}
