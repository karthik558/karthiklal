"use client"

import { FeatureSteps } from "@/components/blocks/feature-section"
import projectsData from "@/public/data/projects.json"

export default function PortfolioSection() {
  // Convert project data to feature format for top 3 projects
  const features = projectsData.projects.slice(0, 3).map((project, index) => {
    // Truncate description to fit better in the layout
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    };

    return {
      step: `Project ${index + 1}`,
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
            A curated selection of projects showcasing my expertise in web development, system administration, and creative problem-solving.
          </p>
        </div>

        <FeatureSteps 
          features={features}
          title=""
          autoPlayInterval={5000}
          imageHeight="h-[500px]"
        />
      </div>
    </section>
  )
}
