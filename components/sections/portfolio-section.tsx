"use client"

import { useState, useEffect } from "react"
import { FeatureSteps } from "@/components/blocks/feature-section"
import { Button } from "@/components/ui/button"
import { ArrowRight, FolderOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import projectsData from "@/public/data/projects.json"

// Define the project type based on the JSON structure
interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  link: string
  github: string
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
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

      {/* Animated blobs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="absolute top-0 left-1/4 w-1 h-1 bg-primary/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-secondary/30 rounded-full animate-pulse"></div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>My Work</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A curated selection of my best projects showcasing expertise in web development,
            system administration, and creative problem-solving with cutting-edge technologies.
          </motion.p>
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
          <div className="relative group">
            {/* Enhanced animated background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full blur opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 animate-gradient-x"></div>

            {/* Button */}
            <Button
              asChild
              size="lg"
              className="relative bg-background hover:bg-background/90 text-foreground border border-primary/20 rounded-full px-8 py-6 font-semibold transition-all duration-300 group-hover:scale-105 shadow-xl"
            >
              <Link href="/projects" className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FolderOpen className="h-5 w-5 text-primary" />
                </motion.div>
                <span>View All Projects</span>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground ml-1 mr-2">({projectsData.projects.length})</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
