"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useMotionTemplate, useMotionValue } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Terminal,
  Shield,
  Cpu,
  Palette,
  Wrench,
} from "lucide-react"

// Icon mapping for skill categories
const iconMap = {
  Code2,
  Terminal,
  Shield,
  Cpu,
  Palette,
  Wrench,
}

interface SkillCategory {
  name: string
  icon: keyof typeof iconMap
  color: string
  bgColor: string
  skills: string[]
}

interface SkillsData {
  skillCategories: SkillCategory[]
}

function SkillCard({ category, index }: { category: SkillCategory, index: number }) {
  const IconComponent = iconMap[category.icon]
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-purple-500/50 opacity-0 transition duration-300 group-hover:opacity-100" />
      <Card className="relative h-full border border-border/50 bg-card/90 backdrop-blur-sm transition-all duration-300 overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(var(--primary-rgb), 0.15),
                transparent 80%
              )
            `,
          }}
        />
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-transform`}>
              <IconComponent className={`h-6 w-6 text-primary`} />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{category.skills.length} skills</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, skillIndex) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 + index * 0.1 + skillIndex * 0.05
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-default text-xs py-1 border border-transparent hover:border-primary/20"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/data/skills.json')
        const data: SkillsData = await response.json()
        setSkillCategories(data.skillCategories)
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      }
    }

    fetchSkills()
  }, [])

  return (
    <section id="skills" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Skills & Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical <span className="text-gradient">Proficiency</span></h2>
          <p className="text-muted-foreground">
            A comprehensive overview of my technical skills and areas of expertise across various domains of software development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
