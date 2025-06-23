"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react"
import { useTheme } from "next-themes"
import projectsData from "@/public/data/projects.json"

// Filtering categories based on available project categories
const categories = ["All", ...new Set(projectsData.projects.map(project => project.category))]

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [showAll, setShowAll] = useState(false)
  const { theme } = useTheme()

  const filteredProjects =
    activeCategory === "All" 
      ? projectsData.projects 
      : projectsData.projects.filter((project) => project.category === activeCategory)

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3)

  const handleShowMore = () => {
    if (showAll) {
      setShowAll(false)
      setTimeout(() => {
        document.getElementById('portfolio')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    } else {
      setShowAll(true)
    }
  }

  return (
    <section id="portfolio" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-2 animate-item">My Work</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-item">Featured <span className="text-gradient">Projects</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-item">
            A curated selection of projects showcasing my expertise in web development, system administration, and creative problem-solving.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-item">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-full button scale-on-scroll"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <Card key={project.id} className="group overflow-hidden card scale-on-scroll">
              <div className="relative overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={640}
                  height={450}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  data-speed={`${0.1 + (index % 3) * 0.1}`}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="secondary" className="button">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer">
                      <Button size="sm" className="button">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <CardTitle className="mb-2 group-hover:text-primary transition-colors animate-item">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm mb-4 animate-item">
                  {project.description}
                </CardDescription>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded animate-item"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show more/less button */}
        {filteredProjects.length > 3 && (
          <div className="text-center mt-12 animate-item">
            <Button 
              variant="outline" 
              onClick={handleShowMore}
              className="rounded-full button scale-on-scroll"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
