"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Search, Grid, List, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import projectsData from "@/public/data/projects.json"
import { cn } from "@/lib/utils"

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  // We keep viewMode state for compatibility, but the new design focuses heavily on the Bento grid.
  // We can treat "list" mode as a single-column layout if they toggle it.
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = useMemo(() => ["All", ...Array.from(new Set(projectsData.projects.map(project => project.category)))], [])

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

  const clearSearch = () => {
    setSearchQuery("")
    setFilter("All")
  }

  // Determine span classes for the Bento Grid based on index
  const getBentoSpanClasses = (index: number) => {
    if (viewMode === "list") return "col-span-1 md:col-span-12 aspect-[4/3] md:aspect-[21/9]"
    
    // Create an asymmetric masonry layout pattern
    const pattern = index % 5
    switch (pattern) {
      case 0: return "col-span-1 md:col-span-8 row-span-2 aspect-square md:aspect-auto" // Large hero project
      case 1: return "col-span-1 md:col-span-4 aspect-square" // Tall skinny side
      case 2: return "col-span-1 md:col-span-4 aspect-square" // Standard square
      case 3: return "col-span-1 md:col-span-4 aspect-[4/3] md:aspect-square" // Standard square
      case 4: return "col-span-1 md:col-span-8 aspect-[4/3] md:aspect-[2/1]" // Wide bottom
      default: return "col-span-1 md:col-span-4 aspect-square"
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-32 bg-background relative selection:bg-primary/30">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/5 via-background to-background" />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 pt-8 flex flex-col items-center"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            My Portfolio
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
            Creative <span className="text-gradient">Showcase</span>
          </h1>
        </motion.div>

        {/* Floating Glass Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 max-w-6xl mx-auto"
        >
          {/* Search */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-full bg-secondary/30 backdrop-blur-md border border-foreground/5 focus:border-primary/50 focus:bg-background transition-all duration-300 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-row items-center justify-between gap-4 w-full lg:w-auto">
            {/* Categories */}
            <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar p-1.5 rounded-full bg-secondary/30 backdrop-blur-md border border-foreground/5 shadow-sm">
              <div className="flex items-center gap-1.5 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={cn(
                      "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      filter === category ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter === category && (
                      <motion.div
                        layoutId="projectFilter"
                        className="absolute inset-0 bg-primary rounded-full shadow-md"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1.5 rounded-full bg-secondary/30 backdrop-blur-md border border-foreground/5 shadow-sm shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("relative p-2.5 rounded-full transition-colors", viewMode === "grid" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {viewMode === "grid" && <motion.div layoutId="viewMode" className="absolute inset-0 bg-primary rounded-full" />}
                <Grid className="w-4 h-4 relative z-10" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("relative p-2.5 rounded-full transition-colors", viewMode === "list" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {viewMode === "list" && <motion.div layoutId="viewMode" className="absolute inset-0 bg-primary rounded-full" />}
                <List className="w-4 h-4 relative z-10" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid layout */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              layout
              key={viewMode}
              className={cn(
                "grid gap-4 md:gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-12 auto-rows-[300px] md:auto-rows-[minmax(300px,380px)]" : "grid-cols-1 md:grid-cols-12 auto-rows-auto"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={cn(
                      "group relative rounded-[2rem] overflow-hidden bg-secondary/20 border border-foreground/5 transition-all duration-500",
                      getBentoSpanClasses(index)
                    )}
                  >
                    {/* Background Image */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-6 right-6 z-20">
                        <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border-none px-4 py-1.5 shadow-xl">
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20">
                      
                      {/* Floating Actions - Slides in on Hover */}
                      <div className="absolute top-6 left-6 flex flex-col gap-3 -translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        {project.link && (
                          <Link href={project.link} target="_blank">
                            <button className="w-12 h-12 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
                              <ExternalLink className="w-5 h-5" />
                            </button>
                          </Link>
                        )}
                        {project.github && (
                          <Link href={project.github} target="_blank">
                            <button className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/10 hover:bg-black shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
                              <Github className="w-5 h-5" />
                            </button>
                          </Link>
                        )}
                      </div>

                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Badge className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md px-3 py-1 font-medium">
                          {project.category}
                        </Badge>
                        
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                          {project.title}
                        </h3>
                        
                        <p className="text-white/70 line-clamp-2 mb-6 font-light max-w-xl text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white font-medium border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md text-white/70 font-medium border border-white/5">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary/50 mb-8 shadow-inner">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">No projects found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                We couldn't find any projects matching your search. Try adjusting the filters.
              </p>
              <button
                onClick={clearSearch}
                className="text-primary hover:text-primary/80 font-medium transition-colors border-b border-primary/50 pb-1"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
