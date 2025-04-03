"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Binary,
  Blocks,
  Box,
  BrainCircuit,
  Code2,
  Cog,
  Cpu,
  Figma,
  FileCode2,
  ImageIcon,
  LayoutGrid,
  Palette,
  PenTool,
  Shield,
  Terminal,
  Wrench,
} from "lucide-react"

// Define skill categories with their respective skills
const skillCategories = [
  {
    name: "Frontend Development",
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    name: "Backend Development",
    icon: Terminal,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    skills: ["Node.js", "Python", "SQL", "MongoDB", "REST APIs"],
  },
  {
    name: "Design & Creative",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Responsive Design", "Web Animation"],
  },
  {
    name: "Tools & Others",
    icon: Wrench,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    skills: ["Git", "DevOps", "Docker", "AWS", "Testing"],
  },
]

export default function SkillsSection() {
  const ref = useRef(null)
  // Update useInView configuration
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Skills & Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Proficiency</h2>
          <p className="text-muted-foreground">
            A comprehensive overview of my technical skills and areas of expertise across various domains of software development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                        className={`px-3 py-2 rounded-lg ${category.bgColor} ${category.color} text-sm font-medium`}
                      >
                        {skill}
                      </motion.div>
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

