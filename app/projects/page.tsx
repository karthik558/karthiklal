"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Search, Grid, List, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"
import projectsData from "@/public/data/projects.json"

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(projectsData.projects.map(project => project.category)))]

  // Filter projects based on selected category and search query
  const filteredProjects = projectsData.projects.filter(project => {
    const matchesCategory = filter === "All" || project.category === filter
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore my complete portfolio of {projectsData.projects.length} projects across various technologies and domains.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 rounded-full border-2 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filter and View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(category)}
                  className="rounded-full text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-full h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-full h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projectsData.projects.length} projects
              {searchQuery && ` for "${searchQuery}"`}
              {filter !== "All" && ` in ${filter}`}
            </p>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  {viewMode === "grid" ? (
                    // Grid View
                    <div className="space-y-4">
                      {/* Project Image */}
                      <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-primary/5 to-primary/10">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.featured && (
                          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Category */}
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>

                        {/* Title */}
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Links */}
                        <div className="flex gap-2 pt-2">
                          {project.link && (
                            <Button asChild size="sm" className="rounded-full flex-1">
                              <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                View
                              </Link>
                            </Button>
                          )}
                          {project.github && (
                            <Button asChild variant="outline" size="sm" className="rounded-full">
                              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex gap-4 p-6">
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {project.category}
                              </Badge>
                              {project.featured && (
                                <Badge className="text-xs bg-primary text-primary-foreground">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                          </div>
                          
                          <div className="flex gap-2">
                            {project.link && (
                              <Button asChild size="sm" variant="outline" className="rounded-full">
                                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                            {project.github && (
                              <Button asChild size="sm" variant="outline" className="rounded-full">
                                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold">No projects found</h3>
              <p className="text-muted-foreground">
                {searchQuery && filter !== "All" 
                  ? `No projects match "${searchQuery}" in the "${filter}" category.`
                  : searchQuery 
                    ? `No projects match "${searchQuery}".`
                    : `No projects found in the "${filter}" category.`
                }
              </p>
              <div className="flex justify-center gap-2">
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline" size="sm">
                    Clear search
                  </Button>
                )}
                {filter !== "All" && (
                  <Button onClick={() => setFilter("All")} variant="outline" size="sm">
                    Show all categories
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/">
              ← Back to Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
