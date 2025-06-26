"use client"

import { FeatureSteps } from "@/components/blocks/feature-section"
import { Button } from "@/components/ui/button"
import { ArrowRight, FolderOpen } from "lucide-react"
import Link from "next/link"
import projectsData from "@/public/data/projects.json"

export default function PortfolioSection() {
  // Filter only featured projects
  const featuredProjects = projectsData.projects.filter(project => project.featured)
  
  // Convert featured project data to feature format
  const features = featuredProjects.map((project, index) => {
    // Truncate description to fit better in the layout
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    };

    return {
      step: `Featured ${index + 1}`,
      title: project.title,
      content: truncateText(project.description, 120), // Limit to ~120 characters
      image: project.image || "/placeholder.svg?height=500&width=800",
      github: project.github,
      link: project.link
    }
  })

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-2 animate-item">My Work</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-item">Featured <span className="text-gradient">Projects</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-item">
            A curated selection of my best projects showcasing expertise in web development, system administration, and creative problem-solving.
          </p>
        </div>

        <FeatureSteps 
          features={features}
          title=""
          autoPlayInterval={5000}
          imageHeight="h-[500px]"
        />

        {/* View All Projects Button */}
        <div className="flex justify-center mt-16">
          <div className="relative group">
            {/* Animated background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button */}
            <Button 
              asChild 
              size="lg" 
              className="relative bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary rounded-full px-8 py-6 font-semibold transition-all duration-300 group-hover:scale-105"
            >
              <Link href="/projects" className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5" />
                <span>View All Projects</span>
                <div className="flex items-center">
                  <span className="text-sm opacity-70">({projectsData.projects.length})</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
