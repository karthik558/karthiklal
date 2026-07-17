"use client"

import { motion } from "framer-motion"
import { Code2, Cpu, Palette, Shield, Terminal, Wrench } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import skillsData from "@/public/data/skills.json"

const iconMap = { Code2, Terminal, Shield, Cpu, Palette, Wrench }

interface SkillCategory {
  name: string
  icon: keyof typeof iconMap
  skills: string[]
}

const categories = skillsData.skillCategories as SkillCategory[]

export default function SkillsSection() {
  return (
    <section id="skills" className="relative overflow-hidden bg-background py-20 md:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-10 lg:mb-12"><SectionHeader eyebrow="Skills & Expertise" title="Technical" highlight="Proficiency" align="left" /></div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon]
            return (
              <motion.article
                key={category.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.38, delay: index * 0.04 }}
                className="interactive-surface group relative min-h-[190px] overflow-hidden rounded-[1.25rem] border border-border/70 bg-card/60 p-6"
              >
                <span className="absolute right-5 top-5 font-display text-3xl font-bold leading-none text-muted-foreground/15 transition-colors group-hover:text-primary/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative flex h-full flex-col pr-8">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-primary/15 bg-primary/10 text-primary"><Icon className="h-[18px] w-[18px]" /></div>
                  <h3 className="mt-5 max-w-[85%] font-display text-lg font-bold leading-tight transition-colors group-hover:text-primary">{category.name}</h3>
                  <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{category.skills.join("  ·  ")}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
