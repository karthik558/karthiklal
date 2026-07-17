"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import skillsData from "@/public/data/skills.json"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div className="interactive-surface relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">

        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-secondary group-hover:bg-primary/10">
              <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.skills.length} skills</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, skillIndex) => (
              <div
                key={skill}
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default text-xs py-1 px-3 border border-border hover:border-primary/50"
                >
                  {skill}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="skills" className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container max-w-7xl relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionHeader eyebrow="Skills & Expertise" title="Technical" highlight="Proficiency" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(skillsData.skillCategories as SkillCategory[]).map((category, index) => (
            <SkillCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
