"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { useTheme } from "next-themes"

// Sample portfolio projects
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with Next.js and Tailwind CSS.",
    image: "/placeholder.svg?height=450&width=640",
    category: "Web Development",
    link: "https://example.com",
    github: "https://github.com",
    technologies: ["Next.js", "Tailwind CSS", "Stripe", "Vercel"],
  },
  {
    id: 2,
    title: "Portfolio Dashboard",
    description: "Interactive dashboard for portfolio tracking with real-time data visualization.",
    image: "/placeholder.svg?height=450&width=640",
    category: "UI/UX Design",
    link: "https://example.com",
    github: "https://github.com",
    technologies: ["React", "D3.js", "Firebase", "Framer Motion"],
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "AI-powered application that generates high-quality content for various purposes.",
    image: "/placeholder.svg?height=450&width=640",
    category: "AI/ML",
    link: "https://example.com",
    github: "https://github.com",
    technologies: ["Python", "TensorFlow", "OpenAI API", "Next.js"],
  },
  {
    id: 4,
    title: "3D Product Configurator",
    description: "Interactive 3D product configurator for customizing product features in real-time.",
    image: "/placeholder.svg?height=450&width=640",
    category: "3D Development",
    link: "https://example.com",
    github: "https://github.com",
    technologies: ["Three.js", "React Three Fiber", "WebGL", "Blender"],
  },
  {
    id: 5,
    title: "Mobile Fitness App",
    description: "Fitness tracking application with workout plans and progress monitoring.",
    image: "/placeholder.svg?height=450&width=640",
    category: "Mobile Development",
    link: "https://example.com",
    github: "https://github.com",
    technologies: ["React Native", "Redux", "Firebase", "Expo"],
  },
  {
    id: 6,
    title: "Smart Home Dashboard",
    description: "IoT dashboard for controlling and monitoring smart home devices.",
    image: "/placeholder.svg?height=450&width=640",
    category: "IoT",
    link: "https://example.com",
    github: "https://github.com",
    technologies: ["React", "Node.js", "MQTT", "Socket.io"],
  },
]

// Filtering categories
const categories = ["All", "Web Development", "UI/UX Design", "3D Development", "Mobile Development", "AI/ML", "IoT"]

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const { theme } = useTheme()

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

  return (
    <section id="portfolio" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Recent Work</h2>
          <p className="text-muted-foreground">
            Explore my latest projects showcasing my skills in web development, design, and creative problem-solving.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full text-sm interactive"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <Card className="h-full overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <div className="h-48 w-full overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={640}
                      height={450}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-3">
                      <Button asChild size="sm" variant="outline" className="bg-white/10 interactive">
                        <Link href={project.github} target="_blank" rel="noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="interactive">
                        <Link href={project.link} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mb-2">
                      {project.category}
                    </span>
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs rounded-full bg-secondary font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

