"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Search, Grid, List, X, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import projectsData from "@/public/data/projects.json"

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get unique categories
  const categories = useMemo(() => ["All", ...Array.from(new Set(projectsData.projects.map(project => project.category)))], [])

  // Filter projects based on selected category and search query
  const filteredProjects = useMemo(() => {
    return projectsData.projects.filter(project => {
      const matchesCategory = filter === "All" || project.category === filter
      const matchesSearch = searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [filter, searchQuery])

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background relative">
      {/* Background Elements - Contained to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Creative <span className="text-gradient">Work</span>
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore a collection of {projectsData.projects.length} projects demonstrating my journey through code, design, and problem-solving.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="sticky top-20 z-30 mb-12 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start border-t border-border/50 pt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${filter === category ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {filter === category && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4 max-w-4xl mx-auto"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`group h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}>
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-52" : "h-52 md:h-full md:w-72"}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3 z-20">
                        <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground shadow-lg">
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center">
                      {project.link && (
                        <Button asChild size="sm" className="rounded-full bg-white/90 text-black hover:bg-white shadow-lg">
                          <Link href={project.link} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                          </Link>
                        </Button>
                      )}
                      {project.github && (
                        <Button asChild size="sm" variant="secondary" className="rounded-full bg-black/80 text-white hover:bg-black shadow-lg">
                          <Link href={project.github} target="_blank">
                            <Github className="w-4 h-4 mr-2" /> Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs font-normal bg-primary/5 border-primary/20 text-primary">
                        {project.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/50">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any projects matching your criteria.
            </p>
            <Button onClick={() => { setFilter("All"); setSearchQuery(""); }} variant="outline">
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
